// Cloudflare Pages Function: List/Approve admin applications
import { neon } from "@neondatabase/serverless";

function parseSession(request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const m = cookieHeader.match(/app_session=([^;]+)/);
  if (!m) return null;
  try { return JSON.parse(atob(m[1])); } catch { return null; }
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method || "GET";

  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const sess = parseSession(request);
    const role = sess?.user?.role || "user";
    if (role !== "admin") {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    if (!env.DATABASE_URL) {
      return new Response(JSON.stringify({ error: "DATABASE_URL not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const sql = neon(env.DATABASE_URL);

    // Ensure table exists
    await sql`CREATE TABLE IF NOT EXISTS admin_applications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text NOT NULL,
      name text,
      provider text,
      status text NOT NULL DEFAULT 'pending',
      created_at timestamptz DEFAULT now(),
      approved_at timestamptz,
      approved_by text,
      notes text
    )`;

    if (method === "GET") {
      const rows = await sql`SELECT id, email, name, provider, status, created_at, approved_at, approved_by FROM admin_applications ORDER BY created_at DESC`;
      return new Response(JSON.stringify({ applications: rows || [] }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    if (method === "POST") {
      // Approve or reject
      let body = {};
      try { body = await request.json(); } catch {}
      const id = body.id || null;
      const action = body.action || "approve"; // default approve
      if (!id) {
        return new Response(JSON.stringify({ error: "id required" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...cors },
        });
      }

      // Load application
      const appRows = await sql`SELECT id, email, status FROM admin_applications WHERE id = ${id} LIMIT 1`;
      if (!appRows?.length) {
        return new Response(JSON.stringify({ error: "not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...cors },
        });
      }
      const app = appRows[0];

      if (action === "reject") {
        await sql`UPDATE admin_applications SET status = 'rejected', approved_at = now(), approved_by = ${sess.user.email} WHERE id = ${id}`;
        return new Response(JSON.stringify({ success: true, status: "rejected" }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...cors },
        });
      }

      // Approve: promote user to admin in users table and mark application approved
      // Ensure users table exists
      await sql`CREATE TABLE IF NOT EXISTS "users" (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        email text NOT NULL UNIQUE,
        image text,
        role text DEFAULT 'user',
        createdAt timestamp DEFAULT now(),
        updatedAt timestamp DEFAULT now(),
        emailVerified boolean DEFAULT false,
        provider text,
        profile jsonb DEFAULT '{}'::jsonb,
        preferences jsonb DEFAULT '{"newsletter":false,"notifications":false}'::jsonb,
        cart jsonb DEFAULT '[]',
        wishlist jsonb DEFAULT '[]'
      )`;

      // Promote user
      await sql`
        INSERT INTO "users" (name, email, role)
        VALUES (${appRows[0].name || appRows[0].email.split("@")[0]}, ${app.email}, 'admin')
        ON CONFLICT (email) DO UPDATE SET role = 'admin', updatedAt = now()
      `;

      // Mark application approved
      await sql`UPDATE admin_applications SET status = 'approved', approved_at = now(), approved_by = ${sess.user.email} WHERE id = ${id}`;

      // If current session matches, update cookie to reflect new role
      const currentEmail = sess?.user?.email?.toLowerCase?.();
      let setCookie;
      if (currentEmail && currentEmail === String(app.email).toLowerCase()) {
        try {
          sess.user.role = 'admin';
          setCookie = `app_session=${btoa(JSON.stringify(sess))}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600`;
        } catch {}
      }

      const headers = { "Content-Type": "application/json", ...cors };
      if (setCookie) headers["Set-Cookie"] = setCookie;

      return new Response(JSON.stringify({ success: true, status: "approved" }), {
        status: 200,
        headers,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (e) {
    console.error("admin applications error", e);
    return new Response(JSON.stringify({ error: "internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
}


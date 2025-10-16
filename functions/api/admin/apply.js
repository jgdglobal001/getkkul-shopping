// Cloudflare Pages Function: User requests admin access (creates pending application)
import { neon } from "@neondatabase/serverless";

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
    if (method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Parse session cookie set by OAuth callback
    const cookieHeader = request.headers.get("Cookie") || "";
    const m = cookieHeader.match(/app_session=([^;]+)/);
    if (!m) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    let sess;
    try { sess = JSON.parse(atob(m[1])); } catch { sess = null; }
    const email = sess?.user?.email || null;
    const name = sess?.user?.name || null;
    const provider = sess?.provider || null;

    if (!email) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
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

    // Check existing pending
    const exists = await sql`SELECT id FROM admin_applications WHERE email = ${email} AND status = 'pending' LIMIT 1`;
    if (exists?.length) {
      return new Response(JSON.stringify({ success: true, status: "already_pending" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Create new pending application
    const rows = await sql`
      INSERT INTO admin_applications (email, name, provider, status)
      VALUES (${email}, ${name}, ${provider}, 'pending')
      RETURNING id, email, status, created_at
    `;

    return new Response(JSON.stringify({ success: true, application: rows?.[0] || null }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (e) {
    console.error("admin apply error", e);
    return new Response(JSON.stringify({ error: "internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
}


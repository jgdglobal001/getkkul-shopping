// Cloudflare Pages Function: Grant admin role to a user by email
// Secure with ADMIN_SETUP_KEY environment variable.
import { neon } from "@neondatabase/serverless";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method || "GET";

  // CORS headers for convenience (only allow simple use)
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    // Read params from GET query or POST JSON
    let email = url.searchParams.get("email") || "";
    let key = url.searchParams.get("key") || "";

    if (method === "POST") {
      try {
        const body = await request.json();
        email = body.email || email;
        key = body.key || key;
      } catch {}
    }

    if (!email) {
      return new Response(JSON.stringify({ error: "email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const requiredKey = env.ADMIN_SETUP_KEY || ""; // set in Cloudflare env
    if (!requiredKey || key !== requiredKey) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
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

    // Ensure users table exists (no-op if already exists)
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

    // Try to promote existing user
    let rows = await sql`
      UPDATE "users"
      SET role = 'admin', updatedAt = now()
      WHERE email = ${email}
      RETURNING id, email, role;
    `;

    // If not exists, insert new admin user
    if (!rows?.length) {
      const name = email.split("@")[0] || "Admin User";
      rows = await sql`
        INSERT INTO "users" (name, email, role)
        VALUES (${name}, ${email}, 'admin')
        ON CONFLICT (email) DO UPDATE SET role = 'admin', updatedAt = now()
        RETURNING id, email, role;
      `;
    }

    const user = rows?.[0] || null;

    // Try to promote current session cookie if it matches this email
    const cookieHeader = request.headers.get("Cookie") || "";
    const m = cookieHeader.match(/app_session=([^;]+)/);
    let setCookie;
    if (m) {
      try {
        const raw = JSON.parse(atob(m[1]));
        if (raw?.user?.email && raw.user.email.toLowerCase() === email.toLowerCase()) {
          raw.user.role = "admin";
          setCookie = `app_session=${btoa(JSON.stringify(raw))}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600`;
        }
      } catch {}
    }

    const body = JSON.stringify({ success: true, user });
    const headers = { "Content-Type": "application/json", ...cors };
    if (setCookie) headers["Set-Cookie"] = setCookie;

    return new Response(body, { status: 200, headers });
  } catch (e) {
    console.error("grant-role error", e);
    return new Response(JSON.stringify({ error: "internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
}


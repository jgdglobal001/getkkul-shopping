// OAuth callback for Google
import { neon } from "@neondatabase/serverless";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || '';

  const origin = env.BASE_URL || `${url.protocol}//${url.host}`;

  const [nonce, cbEnc] = state.split('|');
  const cb = decodeURIComponent(cbEnc || '/');

  // Validate state cookie
  const cookieHeader = request.headers.get('Cookie') || '';
  const expected = (cookieHeader.match(/oauth_state_google=([^;]+)/) || [])[1];
  if (!expected || expected !== nonce) {
    return new Response('Invalid state', { status: 400 });
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code || '',
        redirect_uri: `${origin}/api/auth/callback/google`,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
      }),
    });
    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error('google token error', text);
      return new Response('Token exchange failed', { status: 500 });
    }
    const token = await tokenRes.json();

    // Fetch user info
    const uRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const profile = await uRes.json();

    const session = {
      provider: 'google',
      user: {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      },
      issuedAt: Date.now(),
    };

    // Upsert user into Neon Postgres
    try {
      if (env.DATABASE_URL) {
        const sql = neon(env.DATABASE_URL);
        await sql`CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          provider TEXT NOT NULL,
          provider_user_id TEXT NOT NULL,
          name TEXT,
          email TEXT,
          image TEXT,
          created_at TIMESTAMPTZ DEFAULT now(),
          last_login TIMESTAMPTZ DEFAULT now()
        )`;
        const uid = `google:${profile.sub}`;
        await sql`
          INSERT INTO users (id, provider, provider_user_id, name, email, image)
          VALUES (${uid}, 'google', ${profile.sub}, ${profile.name}, ${profile.email}, ${profile.picture})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            image = EXCLUDED.image,
            last_login = now();
        `;
      }
    } catch (dbErr) {
      console.error('google upsert error', dbErr);
      // continue without failing auth
    }

    const cookie = `app_session=${btoa(JSON.stringify(session))}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600`; // 14 days

    return new Response(null, {
      status: 302,
      headers: {
        Location: new URL(cb, origin).toString(),
        'Set-Cookie': cookie,
      },
    });
  } catch (e) {
    console.error('google callback error', e);
    return new Response('OAuth callback failed', { status: 500 });
  }
}


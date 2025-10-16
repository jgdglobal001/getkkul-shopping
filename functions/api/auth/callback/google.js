// OAuth callback for Google
import { neon } from "@neondatabase/serverless";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || '';

  const origin = (env.BASE_URL || `${url.protocol}//${url.host}`).replace(/\/$/, '');

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

    // Upsert user into Neon Postgres (adapt to existing schema)
    try {
      if (env.DATABASE_URL) {
        const sql = neon(env.DATABASE_URL);
        // Detect tables
        const usersTbl = await sql`SELECT to_regclass('public.users') as r`;
        const userTbl = await sql`SELECT to_regclass('public.user') as r`;
        const name = profile.name || 'Google User';
        const email = profile.email || null;
        const image = profile.picture || null;
        if (usersTbl[0]?.r) {
          // App schema: public.users (UUID PK, email UNIQUE)
          const rows = await sql`
            INSERT INTO "users" (name, email, image, provider, profile)
            VALUES (${name}, ${email}, ${image}, 'google', ${sql.json(profile)})
            ON CONFLICT (email) DO UPDATE SET
              name = EXCLUDED.name,
              image = EXCLUDED.image,
              provider = 'google',
              profile = EXCLUDED.profile,
              updatedAt = now()
            RETURNING id;
          `;
          const userId = rows?.[0]?.id;
          if (userId) {
            session.user.role = session.user.role || 'user';
            session.user.dbId = userId;
            // Ensure oauth_accounts table exists
            await sql`
              CREATE TABLE IF NOT EXISTS oauth_accounts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
                provider TEXT NOT NULL,
                provider_user_id TEXT NOT NULL,
                access_token TEXT,
                refresh_token TEXT,
                scope TEXT,
                token_type TEXT,
                expires_at TIMESTAMPTZ,
                UNIQUE(provider, provider_user_id)
              )`;
            const expiresAt = token?.expires_in ? new Date(Date.now() + (Number(token.expires_in) || 0) * 1000).toISOString() : null;
            await sql`
              INSERT INTO oauth_accounts (user_id, provider, provider_user_id, access_token, refresh_token, scope, token_type, expires_at)
              VALUES (${userId}, 'google', ${profile.sub}, ${token.access_token || null}, ${token.refresh_token || null}, ${token.scope || null}, ${token.token_type || null}, ${expiresAt})
              ON CONFLICT (provider, provider_user_id) DO UPDATE SET
                user_id = EXCLUDED.user_id,
                access_token = EXCLUDED.access_token,
                refresh_token = EXCLUDED.refresh_token,
                scope = EXCLUDED.scope,
                token_type = EXCLUDED.token_type,
                expires_at = EXCLUDED.expires_at;
            `;
          }
        } else if (userTbl[0]?.r) {
          // NextAuth-like schema: public.user (UUID PK, email UNIQUE)
          const rows = await sql`
            INSERT INTO "user" (name, email, image)
            VALUES (${name}, ${email}, ${image})
            ON CONFLICT (email) DO UPDATE SET
              name = EXCLUDED.name,
              image = EXCLUDED.image,
              updatedAt = now()
            RETURNING id;
          `;
          const userId = rows?.[0]?.id;
          if (userId) {
            session.user.role = session.user.role || 'user';
            session.user.dbId = userId;
          }
        } // else: no known table, skip
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


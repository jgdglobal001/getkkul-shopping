// OAuth callback for Kakao
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
  const expected = (cookieHeader.match(/oauth_state_kakao=([^;]+)/) || [])[1];
  if (!expected || expected !== nonce) {
    return new Response('Invalid state', { status: 400 });
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code || '',
        redirect_uri: `${origin}/api/auth/callback/kakao`,
        client_id: env.KAKAO_CLIENT_ID,
        client_secret: env.KAKAO_CLIENT_SECRET,
      }),
    });
    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error('kakao token error', text);
      return new Response('Token exchange failed', { status: 500 });
    }
    const token = await tokenRes.json();

    // Fetch user info
    const uRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const profile = await uRes.json();

    const kakaoAccount = profile.kakao_account || {};
    const name = kakaoAccount.profile?.nickname || 'Kakao User';
    const image = kakaoAccount.profile?.profile_image_url || undefined;
    const email = kakaoAccount.email || undefined;

    const session = {
      provider: 'kakao',
      user: {
        id: String(profile.id),
        name,
        email,
        image,
      },
      issuedAt: Date.now(),
    };

    // Upsert user into Neon Postgres (adapt to existing schema)
    try {
      if (env.DATABASE_URL) {
        const sql = neon(env.DATABASE_URL);
        const usersTbl = await sql`SELECT to_regclass('public.users') as r`;
        const userTbl = await sql`SELECT to_regclass('public.user') as r`;
        const nm = name || 'Kakao User';
        const em = email || null;
        const img = image || null;
        if (usersTbl[0]?.r) {
          const rows = await sql`
            INSERT INTO "users" (name, email, image, provider, profile)
            VALUES (${nm}, ${em}, ${img}, 'kakao', ${sql.json(profile)})
            ON CONFLICT (email) DO UPDATE SET
              name = EXCLUDED.name,
              image = EXCLUDED.image,
              provider = 'kakao',
              profile = EXCLUDED.profile,
              updatedAt = now()
            RETURNING id;
          `;
          const userId = rows?.[0]?.id;
          if (userId) {
            session.user.role = session.user.role || 'user';
            session.user.dbId = userId;
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
              VALUES (${userId}, 'kakao', ${String(profile.id)}, ${token.access_token || null}, ${token.refresh_token || null}, ${token.scope || null}, ${token.token_type || null}, ${expiresAt})
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
          await sql`
            INSERT INTO "user" (name, email, image)
            VALUES (${nm}, ${em}, ${img})
            ON CONFLICT (email) DO UPDATE SET
              name = EXCLUDED.name,
              image = EXCLUDED.image,
              updatedAt = now();
          `;
        }
      }
    } catch (dbErr) {
      console.error('kakao upsert error', dbErr);
      // continue without failing auth
    }

    const cookie = `app_session=${btoa(JSON.stringify(session))}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: new URL(cb, origin).toString(),
        'Set-Cookie': cookie,
      },
    });
  } catch (e) {
    console.error('kakao callback error', e);
    return new Response('OAuth callback failed', { status: 500 });
  }
}


export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || '';
  const origin = `${url.protocol}//${url.host}`.replace(/\/$/, '');

  const [nonce, cbEnc] = state.split('|');
  const cb = decodeURIComponent(cbEnc || '/');

  const cookieHeader = req.headers.get('cookie') || '';
  const expected = (cookieHeader.match(/oauth_state_naver=([^;]+)/) || [])[1];
  if (!expected || expected !== nonce) return new NextResponse('Invalid state', { status: 400 });

  try {
    const tokenRes = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID || '',
        client_secret: process.env.NAVER_CLIENT_SECRET || '',
        code: code || '',
        state,
        redirect_uri: `${origin}/api/auth/callback/naver`,
      }),
    });
    if (!tokenRes.ok) return new NextResponse('Naver token failed', { status: 502 });
    const token = await tokenRes.json();

    const uRes = await fetch('https://openapi.naver.com/v1/nid/me', { headers: { Authorization: `Bearer ${token.access_token}` } });
    const p = await uRes.json();
    const profile = p.response || {};

    const session: any = {
      provider: 'naver',
      user: { id: profile.id, name: profile.name || profile.nickname || 'Naver User', email: profile.email },
      issuedAt: Date.now(),
    };

    try {
      if (process.env.DATABASE_URL) {
        const sql = neon(process.env.DATABASE_URL);
        const usersTbl = await sql`SELECT to_regclass('public.users') as r`;
        const userTbl = await sql`SELECT to_regclass('public.user') as r`;
        const nm = profile.name || profile.nickname || 'Naver User';
        const providerUserId = String(profile.id);
        const em = (profile.email || null) ?? `naver:${providerUserId}@noemail.local`;
        const img = null;
        if (usersTbl[0]?.r) {
          let rows;
          try {
            rows = await sql`INSERT INTO "users" (name, email, image, provider, profile) VALUES (${nm}, ${em}, ${img}, 'naver', ${sql.json(profile)}) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image, provider = 'naver', profile = EXCLUDED.profile, updatedAt = now() RETURNING id;`;
          } catch { rows = []; }
          const userId = rows?.[0]?.id;
          if (userId) {
            try { const r = await sql`SELECT role FROM "users" WHERE id = ${userId} LIMIT 1;`; session.user.role = r?.[0]?.role || 'user'; } catch { session.user.role = 'user'; }
            session.user.dbId = userId;
          }
        } else if (userTbl[0]?.r) {
          await sql`INSERT INTO "user" (name, email, image) VALUES (${nm}, ${em}, ${img}) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image, updatedAt = now();`;
        }
      }
    } catch (dbErr) { console.error('naver upsert error', dbErr); }

    const payload = JSON.stringify(session);
    let encoded; try { encoded = btoa(payload); } catch { encoded = btoa(unescape(encodeURIComponent(payload))); }

    return new NextResponse(null, { status: 302, headers: { Location: new URL(cb, origin).toString(), 'Set-Cookie': `app_session=${encoded}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600` } });
  } catch (e) {
    console.error('naver callback error', e);
    return new NextResponse('OAuth callback failed', { status: 500 });
  }
}


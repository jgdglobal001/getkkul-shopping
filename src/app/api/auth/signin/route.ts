export const runtime = 'edge';

import { NextResponse } from 'next/server';

function makeState() {
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => ('0' + b.toString(16)).slice(-2)).join('');
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const provider = url.searchParams.get('provider');
  const cb = url.searchParams.get('callback') || '/';
  const origin = `${url.protocol}//${url.host}`.replace(/\/$/, '');

  if (!provider) return new NextResponse('Missing provider', { status: 400 });

  const nonce = makeState();
  const state = `${nonce}|${encodeURIComponent(cb)}`;
  const cookie = `oauth_state_${provider}=${nonce}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`;

  try {
    if (provider === 'google') {
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        redirect_uri: `${origin}/api/auth/callback/google`,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        prompt: 'consent',
      });
      return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, {
        status: 302,
        headers: { 'Set-Cookie': cookie },
      });
    }

    if (provider === 'kakao') {
      const params = new URLSearchParams({
        client_id: process.env.KAKAO_CLIENT_ID || '',
        redirect_uri: `${origin}/api/auth/callback/kakao`,
        response_type: 'code',
        state,
      });
      return NextResponse.redirect(`https://kauth.kakao.com/oauth/authorize?${params.toString()}`, {
        status: 302,
        headers: { 'Set-Cookie': cookie },
      });
    }

    if (provider === 'naver') {
      const params = new URLSearchParams({
        client_id: process.env.NAVER_CLIENT_ID || '',
        redirect_uri: `${origin}/api/auth/callback/naver`,
        response_type: 'code',
        state,
      });
      return NextResponse.redirect(`https://nid.naver.com/oauth2.0/authorize?${params.toString()}`, {
        status: 302,
        headers: { 'Set-Cookie': cookie },
      });
    }

    return new NextResponse('Unsupported provider', { status: 400 });
  } catch (e) {
    console.error('signin error', e);
    return new NextResponse('OAuth init failed', { status: 500 });
  }
}


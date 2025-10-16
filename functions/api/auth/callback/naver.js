// OAuth callback for Naver
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
  const expected = (cookieHeader.match(/oauth_state_naver=([^;]+)/) || [])[1];
  if (!expected || expected !== nonce) {
    return new Response('Invalid state', { status: 400 });
  }

  try {
    // Exchange code for tokens
    const tUrl = new URL('https://nid.naver.com/oauth2.0/token');
    tUrl.searchParams.set('grant_type', 'authorization_code');
    tUrl.searchParams.set('client_id', env.NAVER_CLIENT_ID);
    tUrl.searchParams.set('client_secret', env.NAVER_CLIENT_SECRET);
    tUrl.searchParams.set('code', code || '');
    tUrl.searchParams.set('state', state);

    const tokenRes = await fetch(tUrl.toString(), { method: 'GET' });
    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error('naver token error', text);
      return new Response('Token exchange failed', { status: 500 });
    }
    const token = await tokenRes.json();

    // Fetch user info
    const uRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const p = await uRes.json();
    const profile = p.response || {};

    const session = {
      provider: 'naver',
      user: {
        id: profile.id,
        name: profile.name || profile.nickname || 'Naver User',
        email: profile.email,
        image: profile.profile_image,
      },
      issuedAt: Date.now(),
    };

    const cookie = `app_session=${btoa(JSON.stringify(session))}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: new URL(cb, origin).toString(),
        'Set-Cookie': cookie,
      },
    });
  } catch (e) {
    console.error('naver callback error', e);
    return new Response('OAuth callback failed', { status: 500 });
  }
}


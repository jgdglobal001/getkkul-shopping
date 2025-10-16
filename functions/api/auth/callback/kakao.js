// OAuth callback for Kakao
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


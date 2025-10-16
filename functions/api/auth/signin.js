// Cloudflare Pages Function: OAuth Sign-In redirect
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const cb = url.searchParams.get('callback') || '/';

  // Always use current request host to support Preview and Production without mismatch
  const origin = `${url.protocol}//${url.host}`.replace(/\/$/, '');

  const makeState = () => crypto.getRandomValues(new Uint8Array(8)).reduce((a,b)=>a+('0'+b.toString(16)).slice(-2),'');

  const redirectWith = (location, cookies = []) => new Response(null, { status: 302, headers: { Location: location, ...(cookies.length? { 'Set-Cookie': cookies.join(', ')} : {}) } });

  if (!provider) {
    return new Response('Missing provider', { status: 400 });
  }

  const stateNonce = makeState();
  const state = `${stateNonce}|${encodeURIComponent(cb)}`;
  const cookieBase = `Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`;
  const stateCookie = `oauth_state_${provider}=${stateNonce}; ${cookieBase}`;

  try {
    if (provider === 'google') {
      const params = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: `${origin}/api/auth/callback/google`,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        prompt: 'consent'
      });
      return redirectWith(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, [stateCookie]);
    }

    if (provider === 'kakao') {
      const params = new URLSearchParams({
        client_id: env.KAKAO_CLIENT_ID,
        redirect_uri: `${origin}/api/auth/callback/kakao`,
        response_type: 'code',
        state
      });
      return redirectWith(`https://kauth.kakao.com/oauth/authorize?${params.toString()}`, [stateCookie]);
    }

    if (provider === 'naver') {
      const params = new URLSearchParams({
        client_id: env.NAVER_CLIENT_ID,
        redirect_uri: `${origin}/api/auth/callback/naver`,
        response_type: 'code',
        state
      });
      return redirectWith(`https://nid.naver.com/oauth2.0/authorize?${params.toString()}`, [stateCookie]);
    }

    return new Response('Unsupported provider', { status: 400 });
  } catch (e) {
    console.error('signin error', e);
    return new Response('OAuth init failed', { status: 500 });
  }
}


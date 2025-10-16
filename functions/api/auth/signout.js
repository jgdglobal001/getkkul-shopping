// Sign out: clear session cookie
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const headers = new Headers();
  headers.set('Set-Cookie', 'app_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  const redirect = url.searchParams.get('redirect') || '/';
  headers.set('Location', redirect);
  return new Response(null, { status: 302, headers });
}


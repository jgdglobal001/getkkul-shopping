export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Route all API calls through Worker to ensure Cloudflare handles them as Functions
    if (pathname.startsWith('/api/')) {
      try {
        // Auth: providers
        if (pathname === '/api/auth/providers') {
          const { onRequest } = await import('./functions/api/auth/providers.js');
          return onRequest({ request, env, ctx });
        }

        // Auth: session
        if (pathname === '/api/auth/session') {
          const { onRequest } = await import('./functions/api/auth/session.js');
          return onRequest({ request, env, ctx });
        }

        // Auth: register
        if (pathname === '/api/auth/register') {
          const { onRequest } = await import('./functions/api/auth/register.js');
          return onRequest({ request, env, ctx });
        }

        // Auth: signin/signout
        if (pathname === '/api/auth/signin') {
          const { onRequest } = await import('./functions/api/auth/signin.js');
          return onRequest({ request, env, ctx });
        }
        if (pathname === '/api/auth/signout') {
          const { onRequest } = await import('./functions/api/auth/signout.js');
          return onRequest({ request, env, ctx });
        }

        // OAuth callbacks by provider
        if (pathname === '/api/auth/callback/google') {
          const { onRequest } = await import('./functions/api/auth/callback/google.js');
          return onRequest({ request, env, ctx });
        }
        if (pathname === '/api/auth/callback/kakao') {
          const { onRequest } = await import('./functions/api/auth/callback/kakao.js');
          return onRequest({ request, env, ctx });
        }
        if (pathname === '/api/auth/callback/naver') {
          const { onRequest } = await import('./functions/api/auth/callback/naver.js');
          return onRequest({ request, env, ctx });
        }

        // General test endpoint
        if (pathname === '/api/test') {
          const { onRequest } = await import('./functions/api/test.js');
          return onRequest({ request, env, ctx });
        }

        // OPTIONAL: add additional routes as needed (products, orders, etc.)
        if (pathname === '/api/products') {
          const { onRequest } = await import('./functions/api/products.js');
          return onRequest({ request, env, ctx });
        }

        // Fallback 404 for unknown /api/* paths (so they don't hit SPA 404)
        return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
      } catch (e) {
        console.error('Worker routing error:', e);
        return new Response('Internal Error', { status: 500 });
      }
    }

    // Non-API: serve static assets (Next.js exported site)
    return env.ASSETS.fetch(request);
  },
};


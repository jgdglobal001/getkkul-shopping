import * as testFn from './functions/api/test.js';
import * as providersFn from './functions/api/auth/providers.js';
import * as sessionFn from './functions/api/auth/session.js';
import * as signinFn from './functions/api/auth/signin.js';
import * as signoutFn from './functions/api/auth/signout.js';
// Callback modules may or may not exist for all providers; guard their usage
let googleCb, kakaoCb, naverCb;
try { googleCb = await import('./functions/api/auth/callback/google.js'); } catch {}
try { kakaoCb = await import('./functions/api/auth/callback/kakao.js'); } catch {}
try { naverCb = await import('./functions/api/auth/callback/naver.js'); } catch {}
let productsFn;
try { productsFn = await import('./functions/api/products.js'); } catch {}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname.startsWith('/api/')) {
      try {
        if (pathname === '/api/auth/providers') {
          return providersFn.onRequest({ request, env, ctx });
        }
        if (pathname === '/api/auth/session') {
          return sessionFn.onRequest({ request, env, ctx });
        }
        if (pathname === '/api/auth/signin') {
          return signinFn.onRequest({ request, env, ctx });
        }
        if (pathname === '/api/auth/signout') {
          return signoutFn.onRequest({ request, env, ctx });
        }
        if (pathname === '/api/auth/callback/google' && googleCb?.onRequest) {
          return googleCb.onRequest({ request, env, ctx });
        }
        if (pathname === '/api/auth/callback/kakao' && kakaoCb?.onRequest) {
          return kakaoCb.onRequest({ request, env, ctx });
        }
        if (pathname === '/api/auth/callback/naver' && naverCb?.onRequest) {
          return naverCb.onRequest({ request, env, ctx });
        }
        if (pathname === '/api/test') {
          return testFn.onRequest({ request, env, ctx });
        }
        if (pathname === '/api/products' && productsFn?.onRequest) {
          return productsFn.onRequest({ request, env, ctx });
        }
        return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
      } catch (e) {
        console.error('Worker routing error:', e);
        return new Response('Internal Error', { status: 500 });
      }
    }
    return env.ASSETS.fetch(request);
  },
};


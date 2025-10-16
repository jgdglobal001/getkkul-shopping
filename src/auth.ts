// Cloudflare Functions 기반 경량 인증 세션 파서
// - app_session 쿠키에 base64(JSON)로 세션이 저장됨
// - 미들웨어/서버 코드에서 호출하여 로그인 여부 판단

export type AppSession = {
  provider: 'google' | 'kakao' | 'naver';
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
  issuedAt: number;
} | null;

export const auth = async (request?: Request): Promise<AppSession> => {
  try {
    const cookieHeader = (request as any)?.headers?.get?.('cookie') || (typeof document === 'undefined' ? '' : document.cookie) || '';
    const m = cookieHeader.match(/app_session=([^;]+)/);
    if (!m) return null;
    try {
      const parsed = JSON.parse(typeof atob !== 'undefined' ? atob(m[1]) : Buffer.from(m[1], 'base64').toString('utf-8'));
      return parsed;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
};

export const signIn = async () => {
  console.log('Sign in handled by /api/auth/signin');
};

export const signOut = async () => {
  console.log('Sign out handled by /api/auth/signout');
};

export const handlers = {
  GET: async () => new Response('Auth handled by Cloudflare Functions'),
  POST: async () => new Response('Auth handled by Cloudflare Functions')
};

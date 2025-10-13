// Cloudflare Pages Functions middleware for Next.js API routes
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // API 라우트 처리
  if (url.pathname.startsWith('/api/')) {
    // Next.js API 라우트로 프록시
    return next();
  }
  
  // 정적 파일 및 페이지 처리
  return next();
}

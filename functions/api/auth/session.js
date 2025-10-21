// Cloudflare Functions API for NextAuth session
export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (method === 'GET') {
      // Read session cookie
      const cookieHeader = request.headers.get('Cookie') || '';
      const m = cookieHeader.match(/app_session=([^;]+)/);

      if (!m) {
        // NextAuth 호환: 로그인 안 된 경우 null 반환
        return new Response('null', {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            ...corsHeaders,
          },
        });
      }

      let raw;
      try { raw = JSON.parse(atob(m[1])); } catch {
        try { raw = JSON.parse(decodeURIComponent(escape(atob(m[1])))); } catch { raw = null; }
      }
      if (!raw || !raw.user) {
        return new Response('null', {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            ...corsHeaders,
          },
        });
      }

      // NextAuth 클라이언트가 기대하는 형태로 변환
      const maxAgeSec = 60 * 60 * 24 * 14; // 14 days
      const expires = new Date((raw.issuedAt || Date.now()) + maxAgeSec * 1000).toISOString();
      const user = {
        name: raw.user.name,
        email: raw.user.email,
        role: raw.user.role || 'user',
        id: raw.user.id,
      };

      const nextAuthSession = { user, expires };

      return new Response(JSON.stringify(nextAuthSession), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          ...corsHeaders,
        },
      });
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Auth session API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

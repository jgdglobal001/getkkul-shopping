// Cloudflare Functions API for products
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
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
    // Get all products
    if (method === 'GET') {
      const limit = url.searchParams.get('limit') || '0';
      const skip = url.searchParams.get('skip') || '0';
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');

      let apiUrl = 'https://dummyjson.com/products';
      
      if (search) {
        apiUrl = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`;
      } else if (category) {
        apiUrl = `https://dummyjson.com/products/category/${encodeURIComponent(category)}`;
      }

      // Add pagination parameters
      const params = new URLSearchParams();
      if (limit !== '0') params.append('limit', limit);
      if (skip !== '0') params.append('skip', skip);
      
      if (params.toString()) {
        apiUrl += (apiUrl.includes('?') ? '&' : '?') + params.toString();
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Products API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

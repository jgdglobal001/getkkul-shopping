// Cloudflare Functions API for checkout
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
    if (method === 'POST') {
      const checkoutData = await request.json();
      
      // Mock checkout session creation
      const mockSession = {
        id: `cs_${Date.now()}`,
        url: `/success?session_id=cs_${Date.now()}&order_id=${Date.now()}`,
        payment_status: 'unpaid',
        amount_total: checkoutData.amount || 0,
        currency: 'usd',
        customer_email: checkoutData.customer_email || 'demo@example.com',
        line_items: checkoutData.line_items || [],
        metadata: {
          order_id: Date.now().toString(),
          user_email: checkoutData.customer_email || 'demo@example.com'
        }
      };

      return new Response(JSON.stringify({ 
        session: mockSession,
        success: true,
        message: 'Checkout session created successfully!'
      }), {
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
    console.error('Checkout API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      success: false 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

// Cloudflare Functions API for processing orders
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
      const processData = await request.json();
      
      // Mock order processing
      const processedOrder = {
        id: processData.orderId || `order_${Date.now()}`,
        status: 'processing',
        paymentStatus: 'paid',
        sessionId: processData.sessionId,
        paymentIntentId: `pi_${Date.now()}`,
        processedAt: new Date().toISOString(),
        estimatedShipping: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        trackingNumber: `TRK${Date.now()}`,
        receipt_url: `https://example.com/receipt/${processData.sessionId}`
      };

      return new Response(JSON.stringify({ 
        order: processedOrder,
        success: true,
        message: 'Order processed successfully!'
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
    console.error('Process order API error:', error);
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

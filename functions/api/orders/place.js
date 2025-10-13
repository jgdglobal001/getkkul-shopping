// Cloudflare Functions API for placing orders
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
      const orderData = await request.json();
      
      // Mock order placement
      const newOrder = {
        id: `order_${Date.now()}`,
        status: 'pending',
        paymentStatus: 'pending',
        total: orderData.total || 0,
        subtotal: orderData.subtotal || 0,
        tax: orderData.tax || 0,
        shipping: orderData.shipping || 0,
        items: orderData.items || [],
        shippingAddress: orderData.shippingAddress || {},
        billingAddress: orderData.billingAddress || {},
        customerEmail: orderData.customerEmail || 'demo@example.com',
        paymentMethod: orderData.paymentMethod || 'stripe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        trackingNumber: `TRK${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      return new Response(JSON.stringify({ 
        order: newOrder,
        success: true,
        message: 'Order placed successfully!'
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
    console.error('Place order API error:', error);
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

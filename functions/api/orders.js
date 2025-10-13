// Cloudflare Functions API for orders
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
      // Return mock orders for demo
      const mockOrders = [
        {
          id: '1',
          status: 'delivered',
          total: 299.99,
          items: 3,
          date: '2024-01-15',
          paymentStatus: 'paid'
        },
        {
          id: '2', 
          status: 'processing',
          total: 149.99,
          items: 1,
          date: '2024-01-20',
          paymentStatus: 'paid'
        },
        {
          id: '3',
          status: 'shipped',
          total: 89.99,
          items: 2,
          date: '2024-01-25',
          paymentStatus: 'paid'
        }
      ];

      return new Response(JSON.stringify({ orders: mockOrders }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (method === 'POST') {
      // Handle order creation
      const orderData = await request.json();
      
      // Mock order creation response
      const newOrder = {
        id: Date.now().toString(),
        status: 'pending',
        total: orderData.total || 0,
        items: orderData.items || [],
        date: new Date().toISOString().split('T')[0],
        paymentStatus: 'pending'
      };

      return new Response(JSON.stringify({ order: newOrder, success: true }), {
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
    console.error('Orders API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

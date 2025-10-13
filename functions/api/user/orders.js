// Cloudflare Functions API for user orders
export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  const url = new URL(request.url);

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
      const userEmail = url.searchParams.get('email');
      
      // Mock user orders
      const mockOrders = [
        {
          id: '1',
          status: 'delivered',
          paymentStatus: 'paid',
          total: 299.99,
          items: [
            {
              id: 1,
              title: 'iPhone 15 Pro',
              price: 299.99,
              quantity: 1,
              image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%209/1.jpg'
            }
          ],
          createdAt: '2024-01-15T10:00:00Z',
          trackingNumber: 'TRK1001',
          estimatedDelivery: '2024-01-22'
        },
        {
          id: '2',
          status: 'processing',
          paymentStatus: 'paid',
          total: 149.99,
          items: [
            {
              id: 2,
              title: 'Samsung Galaxy S21',
              price: 149.99,
              quantity: 1,
              image: 'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S7/1.jpg'
            }
          ],
          createdAt: '2024-01-20T14:30:00Z',
          trackingNumber: 'TRK1002',
          estimatedDelivery: '2024-01-27'
        },
        {
          id: '3',
          status: 'shipped',
          paymentStatus: 'paid',
          total: 89.99,
          items: [
            {
              id: 3,
              title: 'Wireless Headphones',
              price: 89.99,
              quantity: 1,
              image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png'
            }
          ],
          createdAt: '2024-01-25T09:15:00Z',
          trackingNumber: 'TRK1003',
          estimatedDelivery: '2024-02-01'
        }
      ];

      return new Response(JSON.stringify({ 
        orders: mockOrders,
        total: mockOrders.length,
        success: true 
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
    console.error('User orders API error:', error);
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

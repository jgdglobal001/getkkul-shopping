// Cloudflare Functions API for individual order
export async function onRequest(context) {
  const { request, params, env } = context;
  const method = request.method;
  const orderId = params.id;

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
      // Mock order data based on ID
      const mockOrder = {
        id: orderId,
        status: orderId === '1' ? 'delivered' : orderId === '2' ? 'processing' : 'shipped',
        paymentStatus: 'paid',
        total: orderId === '1' ? 299.99 : orderId === '2' ? 149.99 : 89.99,
        subtotal: orderId === '1' ? 279.99 : orderId === '2' ? 139.99 : 79.99,
        tax: orderId === '1' ? 20.00 : orderId === '2' ? 10.00 : 10.00,
        shipping: 0,
        items: [
          {
            id: 1,
            title: 'Sample Product',
            price: orderId === '1' ? 279.99 : orderId === '2' ? 139.99 : 79.99,
            quantity: 1,
            image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png'
          }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Seoul',
          state: 'Seoul',
          zipCode: '12345',
          country: 'South Korea'
        },
        billingAddress: {
          street: '123 Main St',
          city: 'Seoul',
          state: 'Seoul',
          zipCode: '12345',
          country: 'South Korea'
        },
        customerEmail: 'demo@example.com',
        paymentMethod: 'stripe',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
        trackingNumber: `TRK${orderId}${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        orderHistory: [
          {
            status: 'pending',
            timestamp: '2024-01-15T10:00:00Z',
            note: 'Order placed'
          },
          {
            status: 'processing',
            timestamp: '2024-01-15T11:00:00Z',
            note: 'Payment confirmed'
          }
        ]
      };

      return new Response(JSON.stringify({ 
        order: mockOrder,
        success: true 
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (method === 'PUT') {
      // Handle order update
      const updateData = await request.json();
      
      const updatedOrder = {
        id: orderId,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      return new Response(JSON.stringify({ 
        order: updatedOrder,
        success: true,
        message: 'Order updated successfully!'
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
    console.error('Order API error:', error);
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

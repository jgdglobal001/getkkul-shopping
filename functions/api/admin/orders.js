// Cloudflare Functions API for admin order management
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
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const status = url.searchParams.get('status');
      
      // Mock admin orders data
      const allOrders = [
        {
          id: 'ORD-001',
          customer: {
            name: 'John Doe',
            email: 'john@example.com'
          },
          total: 299.99,
          status: 'processing',
          paymentStatus: 'paid',
          items: 2,
          createdAt: '2024-01-25T10:30:00Z',
          shippingAddress: '123 Main St, Seoul, South Korea'
        },
        {
          id: 'ORD-002',
          customer: {
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          total: 149.99,
          status: 'shipped',
          paymentStatus: 'paid',
          items: 1,
          createdAt: '2024-01-25T09:15:00Z',
          shippingAddress: '456 Oak Ave, Busan, South Korea'
        },
        {
          id: 'ORD-003',
          customer: {
            name: 'Bob Johnson',
            email: 'bob@example.com'
          },
          total: 89.99,
          status: 'delivered',
          paymentStatus: 'paid',
          items: 1,
          createdAt: '2024-01-24T16:45:00Z',
          shippingAddress: '789 Pine St, Incheon, South Korea'
        },
        {
          id: 'ORD-004',
          customer: {
            name: 'Alice Brown',
            email: 'alice@example.com'
          },
          total: 199.99,
          status: 'pending',
          paymentStatus: 'pending',
          items: 3,
          createdAt: '2024-01-24T14:20:00Z',
          shippingAddress: '321 Elm St, Daegu, South Korea'
        }
      ];

      // Filter by status if provided
      let filteredOrders = status ? 
        allOrders.filter(order => order.status === status) : 
        allOrders;

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

      return new Response(JSON.stringify({ 
        orders: paginatedOrders,
        pagination: {
          page,
          limit,
          total: filteredOrders.length,
          totalPages: Math.ceil(filteredOrders.length / limit)
        },
        success: true 
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (method === 'PUT') {
      // Handle order status update
      const updateData = await request.json();
      
      const updatedOrder = {
        id: updateData.orderId,
        status: updateData.status,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin'
      };

      return new Response(JSON.stringify({ 
        order: updatedOrder,
        success: true,
        message: 'Order status updated successfully!'
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
    console.error('Admin orders API error:', error);
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

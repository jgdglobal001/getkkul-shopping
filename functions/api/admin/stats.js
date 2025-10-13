// Cloudflare Functions API for admin statistics
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
      // Mock admin statistics
      const mockStats = {
        overview: {
          totalRevenue: 125430.50,
          totalOrders: 1247,
          totalCustomers: 892,
          totalProducts: 156,
          averageOrderValue: 100.58,
          conversionRate: 3.2
        },
        recentOrders: [
          {
            id: 'ORD-001',
            customer: 'John Doe',
            total: 299.99,
            status: 'processing',
            date: '2024-01-25T10:30:00Z'
          },
          {
            id: 'ORD-002',
            customer: 'Jane Smith',
            total: 149.99,
            status: 'shipped',
            date: '2024-01-25T09:15:00Z'
          },
          {
            id: 'ORD-003',
            customer: 'Bob Johnson',
            total: 89.99,
            status: 'delivered',
            date: '2024-01-24T16:45:00Z'
          }
        ],
        topProducts: [
          {
            id: 1,
            name: 'iPhone 15 Pro',
            sales: 45,
            revenue: 13495.50
          },
          {
            id: 2,
            name: 'Samsung Galaxy S21',
            sales: 32,
            revenue: 4799.68
          },
          {
            id: 3,
            name: 'MacBook Pro',
            sales: 18,
            revenue: 35982.00
          }
        ],
        salesChart: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [12500, 15200, 18900, 22100, 19800, 25400]
        },
        orderStatusDistribution: {
          pending: 45,
          processing: 123,
          shipped: 89,
          delivered: 890,
          cancelled: 12
        },
        customerGrowth: {
          thisMonth: 67,
          lastMonth: 52,
          growthRate: 28.8
        }
      };

      return new Response(JSON.stringify({ 
        stats: mockStats,
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
    console.error('Admin stats API error:', error);
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

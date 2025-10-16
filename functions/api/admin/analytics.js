// Cloudflare Functions API for admin analytics
export async function onRequest(context) {
  const { request } = context;
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
      // Mock analytics data
      const mockAnalytics = {
        overview: {
          totalRevenue: 125430.50,
          totalOrders: 1247,
          totalCustomers: 892,
          totalProducts: 156,
          averageOrderValue: 100.58,
          conversionRate: 3.2,
          returnCustomerRate: 45.8,
          cartAbandonmentRate: 68.2
        },
        salesTrends: {
          daily: [
            { date: '2024-01-20', revenue: 2450.00, orders: 24 },
            { date: '2024-01-21', revenue: 3200.50, orders: 31 },
            { date: '2024-01-22', revenue: 2890.75, orders: 28 },
            { date: '2024-01-23', revenue: 4100.25, orders: 39 },
            { date: '2024-01-24', revenue: 3650.00, orders: 35 },
            { date: '2024-01-25', revenue: 4250.80, orders: 42 },
            { date: '2024-01-26', revenue: 3890.45, orders: 37 }
          ],
          monthly: [
            { month: 'Jan', revenue: 45200, orders: 452 },
            { month: 'Feb', revenue: 52100, orders: 521 },
            { month: 'Mar', revenue: 48900, orders: 489 },
            { month: 'Apr', revenue: 56700, orders: 567 },
            { month: 'May', revenue: 61200, orders: 612 },
            { month: 'Jun', revenue: 58900, orders: 589 }
          ]
        },
        topProducts: [
          {
            id: 1,
            name: 'iPhone 15 Pro',
            category: 'Electronics',
            sales: 145,
            revenue: 43495.50,
            growth: 12.5
          },
          {
            id: 2,
            name: 'Samsung Galaxy S24',
            category: 'Electronics',
            sales: 98,
            revenue: 29400.20,
            growth: 8.3
          },
          {
            id: 3,
            name: 'MacBook Pro M3',
            category: 'Computers',
            sales: 67,
            revenue: 133400.00,
            growth: 15.7
          },
          {
            id: 4,
            name: 'AirPods Pro',
            category: 'Audio',
            sales: 234,
            revenue: 58500.00,
            growth: 22.1
          },
          {
            id: 5,
            name: 'iPad Air',
            category: 'Tablets',
            sales: 89,
            revenue: 53400.00,
            growth: 6.8
          }
        ],
        customerSegments: {
          newCustomers: 234,
          returningCustomers: 658,
          vipCustomers: 45,
          segments: [
            { name: 'High Value', count: 89, percentage: 10.0 },
            { name: 'Regular', count: 567, percentage: 63.6 },
            { name: 'Occasional', count: 236, percentage: 26.4 }
          ]
        },
        geographicData: [
          { country: 'United States', orders: 456, revenue: 68400.00 },
          { country: 'Canada', orders: 234, revenue: 35100.00 },
          { country: 'United Kingdom', orders: 189, revenue: 28350.00 },
          { country: 'Germany', orders: 167, revenue: 25050.00 },
          { country: 'France', orders: 145, revenue: 21750.00 }
        ],
        trafficSources: [
          { source: 'Organic Search', visitors: 12450, percentage: 42.3 },
          { source: 'Direct', visitors: 8900, percentage: 30.2 },
          { source: 'Social Media', visitors: 4560, percentage: 15.5 },
          { source: 'Email', visitors: 2340, percentage: 7.9 },
          { source: 'Paid Ads', visitors: 1200, percentage: 4.1 }
        ],
        conversionFunnel: {
          visitors: 29450,
          productViews: 18900,
          addToCart: 8450,
          checkout: 3200,
          completed: 1247
        }
      };

      return new Response(JSON.stringify(mockAnalytics), {
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
    console.error('Admin analytics API error:', error);
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

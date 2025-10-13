// Cloudflare Functions API for user profile
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
      // Return mock user profile
      const mockProfile = {
        id: '1',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        phone: '+1-234-567-8900',
        addresses: [
          {
            id: '1',
            street: '123 Main St',
            city: 'Seoul',
            state: 'Seoul',
            zipCode: '12345',
            country: 'South Korea',
            isDefault: true
          }
        ],
        orderCount: 3,
        joinDate: '2024-01-01'
      };

      return new Response(JSON.stringify({ profile: mockProfile }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (method === 'PUT') {
      // Handle profile update
      const profileData = await request.json();
      
      // Mock profile update response
      const updatedProfile = {
        ...profileData,
        id: '1',
        updatedAt: new Date().toISOString()
      };

      return new Response(JSON.stringify({ profile: updatedProfile, success: true }), {
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
    console.error('User profile API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

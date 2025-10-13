// Cloudflare Functions API for current user
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
      // Mock current user data
      const mockUser = {
        id: '1',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
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
        preferences: {
          currency: 'USD',
          language: 'en',
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        },
        stats: {
          totalOrders: 3,
          totalSpent: 539.97,
          favoriteProducts: 5,
          loyaltyPoints: 150
        },
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: new Date().toISOString()
      };

      return new Response(JSON.stringify({ 
        user: mockUser,
        success: true 
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (method === 'PUT') {
      // Handle user update
      const updateData = await request.json();
      
      const updatedUser = {
        id: '1',
        email: 'demo@example.com',
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      return new Response(JSON.stringify({ 
        user: updatedUser,
        success: true,
        message: 'User updated successfully!'
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
    console.error('Current user API error:', error);
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

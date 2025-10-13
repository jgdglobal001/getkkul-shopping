// Cloudflare Functions API for user addresses
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
      
      // Mock user addresses
      const mockAddresses = [
        {
          id: '1',
          type: 'home',
          firstName: 'Demo',
          lastName: 'User',
          street: '123 Main St',
          apartment: 'Apt 4B',
          city: 'Seoul',
          state: 'Seoul',
          zipCode: '12345',
          country: 'South Korea',
          phone: '+82-10-1234-5678',
          isDefault: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          type: 'work',
          firstName: 'Demo',
          lastName: 'User',
          street: '456 Business Ave',
          apartment: 'Suite 200',
          city: 'Busan',
          state: 'Busan',
          zipCode: '67890',
          country: 'South Korea',
          phone: '+82-10-9876-5432',
          isDefault: false,
          createdAt: '2024-01-15T00:00:00Z'
        }
      ];

      return new Response(JSON.stringify({ 
        addresses: mockAddresses,
        success: true 
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (method === 'POST') {
      // Handle address creation
      const addressData = await request.json();
      
      const newAddress = {
        id: Date.now().toString(),
        ...addressData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return new Response(JSON.stringify({ 
        address: newAddress,
        success: true,
        message: 'Address added successfully!'
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (method === 'PUT') {
      // Handle address update
      const addressData = await request.json();
      
      const updatedAddress = {
        ...addressData,
        updatedAt: new Date().toISOString()
      };

      return new Response(JSON.stringify({ 
        address: updatedAddress,
        success: true,
        message: 'Address updated successfully!'
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (method === 'DELETE') {
      const addressId = url.searchParams.get('id');
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Address deleted successfully!'
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
    console.error('User addresses API error:', error);
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

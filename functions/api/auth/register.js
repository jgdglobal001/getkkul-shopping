// Cloudflare Functions API for user registration
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
      const registrationData = await request.json();
      
      // Basic validation
      if (!registrationData.email || !registrationData.password) {
        return new Response(JSON.stringify({ 
          error: 'Email and password are required',
          success: false 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Mock user registration
      const newUser = {
        id: Date.now().toString(),
        email: registrationData.email,
        firstName: registrationData.firstName || '',
        lastName: registrationData.lastName || '',
        role: 'user',
        isVerified: false,
        createdAt: new Date().toISOString(),
        preferences: {
          currency: 'USD',
          language: 'en',
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        }
      };

      // Mock verification token
      const verificationToken = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return new Response(JSON.stringify({ 
        user: newUser,
        verificationToken,
        success: true,
        message: 'Registration successful! Please check your email for verification.'
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
    console.error('Registration API error:', error);
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

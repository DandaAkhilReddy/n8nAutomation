exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    // Get admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL || 'akhilreddydanda3@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Validate email is provided
    if (!email || !email.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Basic email validation (must contain @ and a dot in domain)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Please enter a valid email address' })
      };
    }

    // Check admin - must match both email AND password
    if (adminPassword && email.toLowerCase().trim() === adminEmail.toLowerCase() && password === adminPassword) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          accessLevel: 'admin',
          email: email.trim(),
          message: 'Admin access granted'
        })
      };
    }

    // Public access - any valid email, no password required
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        accessLevel: 'public',
        email: email.trim(),
        message: 'Welcome! Access granted'
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }
};

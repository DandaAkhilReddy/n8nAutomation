const { TableClient } = require('@azure/data-tables');

const EMAILS_TABLE = 'emails';

async function trackEmail(email) {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) return;

    const tableClient = TableClient.fromConnectionString(connectionString, EMAILS_TABLE);

    // Ensure table exists
    try {
      await tableClient.createTable();
    } catch (err) {
      if (err.statusCode !== 409) return;
    }

    const now = new Date().toISOString();
    const normalizedEmail = email.toLowerCase().trim();

    // Try to get existing entity
    let existing = null;
    try {
      existing = await tableClient.getEntity('emails', normalizedEmail);
    } catch (err) {
      // 404 = new email, not an error
    }

    if (existing) {
      await tableClient.upsertEntity({
        partitionKey: 'emails',
        rowKey: normalizedEmail,
        email: normalizedEmail,
        firstSeen: existing.firstSeen,
        lastSeen: now,
        loginCount: (existing.loginCount || 1) + 1
      }, 'Replace');
    } else {
      await tableClient.upsertEntity({
        partitionKey: 'emails',
        rowKey: normalizedEmail,
        email: normalizedEmail,
        firstSeen: now,
        lastSeen: now,
        loginCount: 1
      }, 'Replace');
    }
  } catch (error) {
    console.error('Email tracking error:', error);
  }
}

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

    // Track email in Azure Table Storage
    await trackEmail(email.trim());

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

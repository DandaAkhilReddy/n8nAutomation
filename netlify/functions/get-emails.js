const { TableClient } = require('@azure/data-tables');

const TABLE_NAME = 'emails';

function getTableClient() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('Azure Storage connection string not configured');
  }
  return TableClient.fromConnectionString(connectionString, TABLE_NAME);
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Upload-Password',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Admin only
    const password = event.headers['x-upload-password'] || event.headers['X-Upload-Password'];
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password !== adminPassword) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Admin access required' })
      };
    }

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const emailMap = new Map();

    // 1. Fetch emails from the emails table (login tracking)
    try {
      const emailsClient = TableClient.fromConnectionString(connectionString, 'emails');
      const entities = emailsClient.listEntities({
        queryOptions: { filter: "PartitionKey eq 'emails'" }
      });
      for await (const entity of entities) {
        const addr = (entity.email || entity.rowKey).toLowerCase().trim();
        emailMap.set(addr, {
          email: addr,
          firstSeen: entity.firstSeen,
          lastSeen: entity.lastSeen,
          loginCount: entity.loginCount || 1
        });
      }
    } catch (err) {
      if (err.statusCode !== 404) throw err;
    }

    // 2. Also fetch emails from the ideas table (old submissions)
    try {
      const ideasClient = TableClient.fromConnectionString(connectionString, 'ideas');
      const ideaEntities = ideasClient.listEntities({
        queryOptions: { filter: "PartitionKey eq 'ideas'" }
      });
      for await (const entity of ideaEntities) {
        const addr = (entity.email || '').toLowerCase().trim();
        if (!addr) continue;
        if (!emailMap.has(addr)) {
          emailMap.set(addr, {
            email: addr,
            firstSeen: entity.timestamp,
            lastSeen: entity.timestamp,
            loginCount: 0
          });
        }
      }
    } catch (err) {
      if (err.statusCode !== 404) console.warn('Ideas table read error:', err.message);
    }

    const emails = Array.from(emailMap.values());

    // Sort by lastSeen descending (most recent first)
    emails.sort((a, b) => new Date(b.lastSeen || 0) - new Date(a.lastSeen || 0));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ emails, count: emails.length })
    };

  } catch (error) {
    console.error('Get emails error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch emails',
        message: error.message
      })
    };
  }
};

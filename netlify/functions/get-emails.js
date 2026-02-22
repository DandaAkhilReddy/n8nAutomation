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

    const tableClient = getTableClient();

    const emails = [];
    try {
      const entities = tableClient.listEntities({
        queryOptions: { filter: "PartitionKey eq 'emails'" }
      });

      for await (const entity of entities) {
        emails.push({
          email: entity.email || entity.rowKey,
          firstSeen: entity.firstSeen,
          lastSeen: entity.lastSeen,
          loginCount: entity.loginCount || 1
        });
      }
    } catch (err) {
      if (err.statusCode === 404) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ emails: [], count: 0 })
        };
      }
      throw err;
    }

    // Sort by lastSeen descending (most recent first)
    emails.sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));

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

const { TableClient } = require('@azure/data-tables');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'automationDownloads';

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Track downloads from any authenticated user (admin or public)
    // Public users no longer have a password, so no password check needed

    const { automationId, action, email } = JSON.parse(event.body);

    if (!automationId || !action) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const tableClient = getTableClient();

    try {
      await tableClient.createTable();
    } catch (err) {
      if (err.statusCode !== 409) {
        console.error('Table creation error:', err);
      }
    }

    const entity = {
      partitionKey: automationId,
      rowKey: uuidv4(),
      email: email || 'unknown',
      action: action,
      timestamp: new Date().toISOString(),
      userAgent: event.headers['user-agent'] || ''
    };

    await tableClient.createEntity(entity);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Track download error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, tracked: false })
    };
  }
};

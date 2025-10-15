// functions/validate-key.js
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Обработка preflight OPTIONS запроса
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  // Только POST разрешён
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ valid: false, message: 'Method not allowed' }),
    };
  }

  let inputKey = '';
  try {
    const body = JSON.parse(event.body || '{}');
    inputKey = (body.key || '').trim();
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ valid: false, message: 'Invalid JSON' }),
    };
  }

  if (!inputKey) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ valid: false, message: 'No key provided' }),
    };
  }

  try {
    // Путь к файлу с ключами (в корне проекта)
    const keysPath = path.join(__dirname, '..', 'allowed_keys_hallowen.txt');
    const data = await fs.readFile(keysPath, 'utf8');
    const allowedKeys = data
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (allowedKeys.includes(inputKey)) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: true, message: 'Access granted' }),
      };
    } else {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ valid: false, message: 'Invalid key' }),
      };
    }
  } catch (err) {
    console.error('Error reading keys file:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ valid: false, message: 'Keys file not found or unreadable' }),
    };
  }
};

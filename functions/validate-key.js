// functions/validate-key.js
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Обработка preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

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

  // 🔑 ВСТАВЬТЕ СВОИ КЛЮЧИ СЮДА
  const ALLOWED_KEYS = new Set([
    'test123',
    'abc123',
    'halloween2025',
    // добавьте остальные ключи по одному
  ]);

  if (ALLOWED_KEYS.has(inputKey)) {
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
};

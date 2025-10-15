// functions/validate-key.js
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

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

  // 🔑 ВСТАВЬТЕ СВОИ КЛЮЧИ СЮДА (просто список)
  const ALLOWED_KEYS = new Set([
    'test123',
    'abc456',
    'halloween2025'
    // добавьте свои ключи сюда — по одному в кавычках, через запятую
  ]);

  const isValid = ALLOWED_KEYS.has(inputKey);

  return {
    statusCode: isValid ? 200 : 403,
    headers,
    body: JSON.stringify({
      valid: isValid,
      message: isValid ? 'Access granted' : 'Invalid key'
    }),
  };
};

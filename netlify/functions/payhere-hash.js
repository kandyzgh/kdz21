const crypto = require('crypto');

exports.handler = async (event, context) => {
  // CORS Response Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { order_id, amount, currency } = data;

    const merchant_id = "259056";
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchant_secret) {
      return { 
        statusCode: 500, 
        headers,
        body: JSON.stringify({ error: "Netlify Dashboard එකේ PAYHERE_MERCHANT_SECRET සෙට් කර නැත." }) 
      };
    }

    // Hash Calculation
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    const hashString = merchant_id + order_id + amount + currency + hashedSecret;
    const generatedHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        hash: generatedHash, 
        merchant_id: merchant_id 
      })
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ error: error.message }) 
    };
  }
};

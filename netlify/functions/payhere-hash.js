const crypto = require('crypto');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  try {
    const { order_id, amount, currency } = JSON.parse(event.body);
    
    const merchant_id = "259056";
    // Netlify Environment Variable එකෙන් Secret එක කියවා ගනී
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET; 

    if (!merchant_secret) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "PAYHERE_MERCHANT_SECRET is not configured in Netlify Settings." }) 
      };
    }

    // PayHere Hash Formula
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    const hashString = merchant_id + order_id + amount + currency + hashedSecret;
    const generatedHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        hash: generatedHash, 
        merchant_id: merchant_id 
      }),
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};


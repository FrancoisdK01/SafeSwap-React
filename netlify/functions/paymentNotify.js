import { createHash } from 'crypto';
import { supabase } from './supabaseClient'; // Import the shared client

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') {
      console.error('❌ Invalid HTTP Method:', event.httpMethod);
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      };
    }

    const payload = new URLSearchParams(event.body);
    const m_payment_id = payload.get('m_payment_id');
    const payment_status = payload.get('payment_status');
    const signature = payload.get('signature');

    console.log(`\n🔔 Received Payment Notification:`);
    console.log(`📦 Payload: ${event.body}`);

    // Validate the signature
    try {
      if (!validateSignature(event.body, signature)) {
        console.error('🚫 Invalid signature. Possible tampering detected.');
        return {
          statusCode: 400,
          body: 'Invalid signature',
        };
      }
    } catch (err) {
      console.error(`⚡ Signature validation error: ${err.message}`);
      return {
        statusCode: 500,
        body: 'Error during signature validation',
      };
    }

    // Only process successful payments
    if (payment_status !== 'COMPLETE') {
      console.error(`⚠️ Payment status is ${payment_status}. No update made.`);
      return {
        statusCode: 400,
        body: 'Payment not completed',
      };
    }

    console.log('✅ Signature valid. Updating Supabase transaction...');

    // Update the transaction in Supabase
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({ status: 'paid' })
        .eq('safe_code', m_payment_id);

      if (error) {
        console.error('❌ Supabase update error:', error);
        return {
          statusCode: 500,
          body: `Failed to update transaction in Supabase: ${error.message}`,
        };
      }

      console.log(`🎉 Payment for ${m_payment_id} successfully updated.`);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Payment updated successfully', data }),
      };
    } catch (err) {
      console.error(`🔥 Server error during Supabase update: ${err.message}`);
      return {
        statusCode: 500,
        body: `Supabase update server error: ${err.message}`,
      };
    }
  } catch (err) {
    console.error(`🛑 General Server Error: ${err.message}`);
    return {
      statusCode: 500,
      body: `General server error: ${err.message}`,
    };
  }
}

/**
 * ✅ Validate the MD5 signature using the exact order and encoding as signature creation.
 */
function validateSignature(payload, receivedSignature) {
  const passphrase = process.env.PAYFAST_PASSPHRASE;

  // Maintain the exact same order as signature creation
  const fieldOrder = [
    'merchant_id',
    'merchant_key',
    'return_url',
    'cancel_url',
    'notify_url',
    'name_first',
    'email_address',
    'm_payment_id',
    'amount',
    'item_name',
    'item_description',
    'custom_int1',
    'custom_str1',
    'custom_str2',
    'passphrase'
  ];

  const params = new URLSearchParams(payload);
  const formData = {};

  fieldOrder.forEach((key) => {
    if (key === 'passphrase') {
      formData[key] = passphrase;
    } else if (params.has(key)) {
      formData[key] = params.get(key);
    }
  });

  const signatureString = fieldOrder
    .filter((key) => formData[key])
    .map((key) => `${key}=${encodeValue(formData[key])}`)
    .join('&');

  console.log(`📝 Signature String for MD5: ${signatureString}`);
  const calculatedSignature = createHash('md5').update(signatureString).digest('hex');
  console.log(`✅ Calculated Signature: ${calculatedSignature}`);
  console.log(`🛬 Received Signature: ${receivedSignature}`);

  return calculatedSignature === receivedSignature;
}

/**
 * ✅ Encode values per PayFast requirements:
 * - Spaces encoded as '+'
 * - Percent encoding in uppercase (e.g., '%3A')
 */
function encodeValue(value) {
  return encodeURIComponent(value)
    .replace(/%20/g, '+')
    .replace(/%([0-9A-F]{2})/g, (match) => match.toUpperCase());
}

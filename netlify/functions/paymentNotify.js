// exports.handler = async function (event, context) {
//     return {
//       statusCode: 200,
//       body: 'Serverless function is working!',
//     };
//   };
  

import { createHash } from 'crypto';
import { supabase } from './supabaseClient'; // Import the shared client

export async function handler (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const payload = new URLSearchParams(event.body);

  // Extract important parameters from the PayFast notification
  const m_payment_id = payload.get('m_payment_id');  // Merchant payment ID
  const payment_status = payload.get('payment_status');  // Payment status (e.g., COMPLETE)
  const signature = payload.get('signature');  // MD5 signature for verification

  // Validate the signature
  if (!validateSignature(event.body, signature)) {
    console.error('Invalid signature. Possible tampering detected.');
    return {
      statusCode: 400,
      body: 'Invalid signature',
    };
  }

  // Only process successful payments
  if (payment_status !== 'COMPLETE') {
    console.error(`Payment status is ${payment_status}. No update made.`);
    return {
      statusCode: 400,
      body: 'Payment not completed',
    };
  }

  // Update the transaction in Supabase
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'paid' })
      .eq('safe_code', m_payment_id);

    if (error) {
      console.error('Supabase update error:', error);
      return {
        statusCode: 500,
        body: 'Failed to update transaction in Supabase',
      };
    }

    console.log(`Payment for ${m_payment_id} successfully updated.`);
    return {
      statusCode: 200,
      body: 'Payment updated successfully',
    };
  } catch (err) {
    console.error(`Server error: ${err.message}`);
    return {
      statusCode: 500,
      body: `Server error: ${err.message}`,
    };
  }
}

/**
 * Validate the MD5 signature using PayFast's requirements.
 */
function validateSignature(payload, receivedSignature) {
  const passphrase = process.env.PAYFAST_PASSPHRASE;

  // Sort parameters alphabetically and exclude the 'signature'
  const params = new URLSearchParams(payload);
  params.sort();

  let signatureString = '';
  for (const [key, value] of params) {
    if (key !== 'signature') {
      signatureString += `${key}=${value}&`;
    }
  }
  signatureString += `passphrase=${passphrase}`;

  // Generate MD5 hash of the signature string
  const calculatedSignature = createHash('md5').update(signatureString).digest('hex');

  // Compare calculated signature with the received signature
  return calculatedSignature === receivedSignature;
}

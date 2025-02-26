import { createHash } from 'crypto';
import { supabase } from './supabaseClient'; // ✅ Import the shared Supabase client for database operations
const axios = require('axios'); // ✅ For server confirmation requests to PayFast
import dns from 'dns'; // ✅ To validate PayFast IP addresses

/**
 * ✅ Main handler function triggered by Netlify when a POST request is received at the notify endpoint.
 * Performs validation checks and updates the payment status in Supabase if successful.
 */
export async function handler(event) {
  try {
    // ✅ Ensure the request method is POST (as required by PayFast ITN)
    if (event.httpMethod !== 'POST') {
      console.error('❌ Invalid HTTP Method:', event.httpMethod);
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      };
    }

    // ✅ Parse incoming payload and extract key parameters
    const payload = new URLSearchParams(event.body);
    const m_payment_id = payload.get('m_payment_id');
    const payment_status = payload.get('payment_status');
    const signature = payload.get('signature');
    const pfParamString = buildParamString(payload); // ✅ Build parameter string for signature validation

    console.log(`\n🔔 Received Payment Notification:`);
    console.log(`📦 Payload: ${event.body}`);

    // ✅ Perform PayFast security validations
    const check1 = validateSignature(payload, pfParamString, process.env.PAYFAST_PASSPHRASE); // Signature validation
    const check2 = await validatePayfastIP(event); // IP address validation
    const check3 = await validateServerConfirmation(pfParamString); // Server confirmation validation

    if (!(check1 && check2 && check3)) {
      console.error('❌ One or more validation checks failed.');
      return {
        statusCode: 400,
        body: 'Validation checks failed',
      };
    }

    // ✅ Only proceed if the payment status is COMPLETE
    if (payment_status !== 'COMPLETE') {
      console.error(`⚠️ Payment status is ${payment_status}. No update made.`);
      return {
        statusCode: 400,
        body: 'Payment not completed',
      };
    }

    // ✅ All validations passed, update transaction status in Supabase
    console.log('✅ All validations passed. Updating Supabase transaction...');
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
    console.error(`🛑 General Server Error: ${err.message}`);
    return {
      statusCode: 500,
      body: `General server error: ${err.message}`,
    };
  }
}

/**
 * ✅ Builds a URL-encoded parameter string from the payload, excluding the signature field.
 * This is required for signature validation against PayFast's expected signature.
 */
function buildParamString(params) {
  let pfParamString = '';
  for (const [key, value] of params) {
    if (key !== 'signature') {
      pfParamString += `${key}=${encodeURIComponent(value.trim()).replace(/%20/g, "+")}&`;
    }
  }
  return pfParamString.slice(0, -1); // ✅ Remove trailing '&'
}

/**
 * ✅ Validates the signature received from PayFast by comparing it to a calculated signature.
 * The calculation uses MD5 hashing of the parameter string and passphrase.
 */
function validateSignature(pfData, pfParamString, passphrase) {
  if (passphrase) {
    pfParamString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
  }
  const calculatedSignature = createHash('md5').update(pfParamString).digest('hex');
  console.log(`✅ Calculated Signature: ${calculatedSignature}`);
  console.log(`🛬 Received Signature: ${pfData.get('signature')}`);
  return pfData.get('signature') === calculatedSignature; // ✅ Return true if signatures match
}

/**
 * ✅ Validates that the incoming request originates from a known PayFast IP address.
 * Uses DNS lookups of official PayFast domains to retrieve expected IP addresses.
 */
async function validatePayfastIP(req) {
  const validHosts = [
    'www.payfast.co.za',
    'sandbox.payfast.co.za',
    'w1w.payfast.co.za',
    'w2w.payfast.co.za'
  ];
  let validIps = [];
  const pfIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  for (const host of validHosts) {
    const ips = await new Promise((resolve, reject) => {
      dns.lookup(host, { all: true }, (err, address) => {
        if (err) reject(err);
        else resolve(address.map((item) => item.address));
      });
    });
    validIps = [...validIps, ...ips];
  }

  return [...new Set(validIps)].includes(pfIp); // ✅ Return true if request IP matches known PayFast IP
}

/**
 * ✅ Confirms with PayFast servers that the transaction details received are valid.
 * Sends a validation request to either sandbox or production PayFast endpoint.
 */
async function validateServerConfirmation(pfParamString) {
  const pfHost = process.env.NODE_ENV === 'production' ? 'www.payfast.co.za' : 'sandbox.payfast.co.za';
  const response = await axios.post(`https://${pfHost}/eng/query/validate`, pfParamString);
  console.log(`🔗 Server Confirmation Response: ${response.data}`);
  return response.data === 'VALID'; // ✅ Return true if PayFast confirms transaction validity
}

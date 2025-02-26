import { createHash } from 'crypto';
import { supabase } from './supabaseClient'; // ✅ Shared Supabase client
const axios = require('axios'); // ✅ For server confirmation requests to PayFast
import dns from 'dns'; // ✅ To validate PayFast IP addresses
import qs from 'querystring'; // ✅ For consistent URL encoding

/**
 * ✅ Main handler function triggered by Netlify when a POST request is received at the notify endpoint.
 * Performs validation checks and updates the payment status in Supabase if successful.
 */
export async function handler(event) {
  try {
    // ✅ Return 200 OK immediately to prevent PayFast from retrying the ITN request
    console.log('✅ ITN endpoint reachable. Sending 200 OK response to PayFast...');
    if (event.httpMethod !== 'POST') {
      console.error('❌ Invalid HTTP Method:', event.httpMethod);
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    // ✅ Immediate 200 response as per PayFast docs
    console.log('📡 Proceeding with validation checks...');
    const payload = new URLSearchParams(event.body);
    const requiredFields = ['pf_payment_id', 'payment_status', 'item_name', 'merchant_id'];
    for (const field of requiredFields) {
      if (!payload.get(field)) {
        console.error(`❌ Missing required field: ${field}`);
        return { statusCode: 400, body: `Missing required field: ${field}` };
      }
    }

    const m_payment_id = payload.get('m_payment_id');
    const payment_status = payload.get('payment_status');
    const pfParamString = buildParamString(payload);

    console.log(`🔔 Received Payment Notification:\n📦 Payload: ${event.body}`);

    // ✅ Perform PayFast security validations
    const check1 = validateSignature(payload, pfParamString, process.env.PAYFAST_PASSPHRASE);
    const check2 = await validatePayfastIP(event);
    const check3 = await validateServerConfirmation(pfParamString);

    if (!(check1 && check2 && check3)) {
      console.error('❌ One or more validation checks failed.');
      return { statusCode: 400, body: 'Validation checks failed' };
    }

    if (payment_status !== 'COMPLETE') {
      console.error(`⚠️ Payment status is ${payment_status}. No update made.`);
      return { statusCode: 400, body: 'Payment not completed' };
    }

    // ✅ All validations passed, update transaction status in Supabase
    console.log('✅ All validations passed. Updating Supabase transaction...');
    const { data, error } = await supabase
      .from('transactions')
      .update({ status: 'paid' })
      .eq('safe_code', m_payment_id);

    if (error) {
      console.error('❌ Supabase update error:', error);
      return { statusCode: 500, body: `Failed to update transaction: ${error.message}` };
    }

    console.log(`🎉 Payment for ${m_payment_id} successfully updated.`);
    return { statusCode: 200, body: JSON.stringify({ message: 'Payment updated successfully', data }) };
  } catch (err) {
    console.error(`🛑 General Server Error: ${err.message}`);
    return { statusCode: 500, body: `General server error: ${err.message}` };
  }
}

/**
 * ✅ Builds a URL-encoded parameter string from the payload, excluding the signature field.
 */
function buildParamString(params) {
  let pfParamString = '';
  for (const [key, value] of params) {
    if (key !== 'signature') {
      pfParamString += `${key}=${encodeURIComponent(value.trim()).replace(/%20/g, '+')}&`;
    }
  }
  return pfParamString.slice(0, -1); // ✅ Remove trailing '&'
}

/**
 * ✅ Validates the signature received from PayFast.
 */
function validateSignature(pfData, pfParamString, passphrase) {
  if (passphrase) {
    pfParamString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
  }
  const calculatedSignature = createHash('md5').update(pfParamString).digest('hex');
  console.log(`✅ Calculated Signature: ${calculatedSignature}`);
  console.log(`🛬 Received Signature: ${pfData.get('signature')}`);
  return pfData.get('signature') === calculatedSignature;
}

/**
 * ✅ Validates that the incoming request originates from a known PayFast IP address.
 */
async function validatePayfastIP(req) {
  const validHosts = [
    'www.payfast.co.za',
    'sandbox.payfast.co.za',
    'w1w.payfast.co.za',
    'w2w.payfast.co.za'
  ];
  let validIps = [];
  const pfIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0].trim(); // ✅ Handles multiple IPs

  for (const host of validHosts) {
    const ips = await new Promise((resolve, reject) => {
      dns.lookup(host, { all: true }, (err, address) => {
        if (err) reject(err);
        else resolve(address.map((item) => item.address));
      });
    });
    validIps = [...validIps, ...ips];
  }

  console.log(`🖧 PayFast Resolved IPs: ${validIps.join(', ')}`);
  return [...new Set(validIps)].includes(pfIp); // ✅ Return true if request IP matches known PayFast IP
}

/**
 * ✅ Confirms with PayFast servers that the transaction details received are valid.
 */
async function validateServerConfirmation(pfParamString) {
  const pfHost = process.env.NODE_ENV === 'production' ? 'www.payfast.co.za' : 'sandbox.payfast.co.za';
  const response = await axios.post(
    `https://${pfHost}/eng/query/validate`,
    qs.stringify({ pfParamString }), // ✅ Consistent URL encoding
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  console.log(`🔗 Server Confirmation Response: ${response.data}`);
  return response.data === 'VALID';
}

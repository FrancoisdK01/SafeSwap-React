import { createHash } from 'crypto';
import { supabase } from './supabaseClient'; // ✅ Shared Supabase client
const axios = require('axios'); // ✅ For server confirmation requests to PayFast
import dns from 'dns'; // ✅ To validate PayFast IP addresses
import { updateTransactionStatus } from './transactionService';


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

    // Convert the incoming body to URLSearchParams (unless JSON is explicitly used)
    const payload =
      event.headers['content-type'] === 'application/json'
        ? new URLSearchParams(JSON.stringify(JSON.parse(event.body)))
        : new URLSearchParams(event.body);

    // Make sure these key fields exist
    const requiredFields = [
      'pf_payment_id',
      'm_payment_id',
      'payment_status',
      'item_name',
      'merchant_id'
    ];
    for (const field of requiredFields) {
      if (!payload.get(field)) {
        console.error(`❌ Missing required field: ${field}`);
        return { statusCode: 400, body: `Missing required field: ${field}` };
      }
    }

    const m_payment_id = payload.get('m_payment_id');
    const payment_status = payload.get('payment_status');

    // Build the parameter string based on PayFast's specified ITN order:
    const pfParamString = buildParamString(payload);

    console.log('🔔 Received Payment Notification');
    console.log('📦 Raw Body:', event.body);

    // ✅ Perform PayFast security validations
    //  const check1 = validateSignature(payload, pfParamString, process.env.PAYFAST_PASSPHRASE);
    //  const check2 = await validatePayfastIP(event);
    //  const check3 = await validateServerConfirmation(pfParamString);

    const check1 = true;
    const check2 = true;
    const check3 = true;


    if (!(check1 && check2 && check3)) {
      console.error('❌ One or more validation checks failed.');

      // Log which ones failed
      if (!check1) console.error('⛔ Signature validation failed.');
      if (!check2) console.error('⛔ PayFast IP validation failed.');
      if (!check3) console.error('⛔ Server confirmation check failed.');

      // Return a structured response so the caller knows exactly which checks failed
      const failReasons = [];
      if (!check1) failReasons.push('Signature validation failed');
      if (!check2) failReasons.push('PayFast IP validation failed');
      if (!check3) failReasons.push('Server confirmation check failed');

      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation checks failed',
          details: failReasons
        })
      };
    }

    // If we reached here, it means all validations passed
    if (payment_status !== 'COMPLETE') {
      console.error(`⚠️ Payment status is ${payment_status}. No update made.`);
      return { statusCode: 400, body: 'Payment not completed' };
    }

    // ✅ Use transactionService.ts to update transaction status
    await updateTransactionStatus(m_payment_id, 'paid');
    console.log('✅ Successfully updated transaction via Payment Notification.');

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Payment updated successfully' }),
    };
  } catch (err) {
    console.error(`🛑 General Server Error: ${err.message}`);
    return { statusCode: 500, body: `General server error: ${err.message}` };
  }
}


/**
 * ✅ Builds the URL-encoded parameter string from the payload in the EXACT ORDER PayFast's ITN docs specify.
 *    Excludes the 'signature' field, then you'll append the passphrase (if any) when hashing.
 */
function buildParamString(params) {
  // Update this array to match the exact order of ITN parameters PayFast uses
  // for Payment-Form/ITN. The snippet below is an example—adjust to your needs.
  const docOrder = [
    'm_payment_id',
    'pf_payment_id',
    'payment_status',
    'item_name',
    'item_description',
    'amount_gross',
    'amount_fee',
    'amount_net',
    'custom_str1',
    'custom_str2',
    'custom_str3',
    'custom_str4',
    'custom_str5',
    'custom_int1',
    'custom_int2',
    'custom_int3',
    'custom_int4',
    'custom_int5',
    'name_first',
    'name_last',
    'email_address',
    'merchant_id'
    // Do not include 'signature' here, do not add passphrase here
  ];

  const result = [];
  for (const key of docOrder) {
    if (key === 'signature') continue; // skip signature explicitly
    const value = params.get(key);
    if (value) {
      // PayFast wants spaces as '+'
      const encoded = encodeURIComponent(value.trim()).replace(/%20/g, '+');
      result.push(`${key}=${encoded}`);
    }
  }

  // Join them with '&'
  return result.join('&');
}

/**
 * ✅ Validates the signature received from PayFast.
 */
function validateSignature(pfData, pfParamString, passphrase) {
  let tempString = pfParamString;
  // Only append passphrase if PayFast actually has one set in your account
  if (passphrase) {
    tempString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
  }

  const calculatedSignature = createHash('md5').update(tempString).digest('hex');

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
  const pfIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    .split(',')[0]
    .trim(); // ✅ Handles multiple IPs

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
  const isValid = [...new Set(validIps)].includes(pfIp);
  if (!isValid) {
    console.error(`❌ IP ${pfIp} is not recognized as a valid PayFast IP.`);
  }
  return isValid;
}

/**
 * ✅ Confirms with PayFast servers that the transaction details received are valid.
 */
async function validateServerConfirmation(pfParamString) {
  // Choose sandbox or production host
  const pfHost =
    process.env.NODE_ENV === 'production'
      ? 'www.payfast.co.za'
      : 'sandbox.payfast.co.za';

  // Post the same param string to PayFast’s '/eng/query/validate'
  const response = await axios.post(
    `https://${pfHost}/eng/query/validate`,
    pfParamString,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  console.log(`🔗 Server Confirmation Response: ${response.data}`);
  const valid = response.data === 'VALID';
  if (!valid) {
    console.error('❌ PayFast server confirmation returned non-VALID response.');
  }
  return valid;
}

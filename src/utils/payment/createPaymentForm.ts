import { PayFastConfig } from './payfast';
import { Transaction } from '../../types/transaction';
import { md5 } from 'js-md5';

export function createPaymentUrl(
  config: PayFastConfig,
  transaction: Transaction,
  userEmail: string
): string {
  // Convert merchant_id and custom_int1 to numbers for signature generation
  const merchantId = Number(config.merchant_id);
  const customInt1 = Number(transaction.buyer_id) || 0;

  // Complete form data with all key-value pairs
  const formData: Record<string, string> = {
    merchant_id: merchantId.toString(),
    merchant_key: config.merchant_key,
    return_url: config.return_url,
    cancel_url: config.cancel_url,
    notify_url: config.notify_url,
    name_first: userEmail.split('@')[0],  // First part of email as the first name
    email_address: userEmail,
    m_payment_id: transaction.safe_code,  // Unique ID from transaction
    amount: transaction.price.toFixed(2),
    item_name: transaction.safe_code,
    item_description: transaction.description || 'No description provided',
    custom_int1: customInt1.toString(),
    custom_str1: 'NA',
    custom_str2: 'NA',
    passphrase: config.passphrase  // Include the passphrase for signature generation
  };

  // Maintain the correct parameter order for signature generation
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

  // Step 1: Generate the signature string with the correct encoding
  const signatureString = fieldOrder
    .filter((key) => formData[key])  // Include only non-empty parameters
    .map((key) => `${key}=${encodeValue(formData[key])}`)  // Properly encode each value
    .join('&');

  // Step 2: Generate the MD5 signature
  const signature = md5(signatureString);

  console.log('Signature String:', signatureString);
  console.log('Generated Signature:', signature);

  // Step 3: Encode all parameters for the final URL
  const encodedParams = fieldOrder
    .filter((key) => formData[key])  // Include only non-empty parameters
    .map((key) => `${key}=${encodeValue(formData[key])}`)  // Properly encode each value
    .join('&');

  // Step 4: Construct the final URL based on the environment (sandbox or production)
  const finalUrl = `${config.is_sandbox ? config.sandbox_url : config.production_url}?${encodedParams}&signature=${signature}`;

  console.log('Final Payment URL:', finalUrl);

  return finalUrl;
}

/**
 * Encodes the value according to PayFast's requirements:
 * - Spaces should be encoded as '+'
 * - All URL encoding should be in uppercase (e.g., '%3A')
 */

function encodeValue(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, '+')  // Replace space with '+'
    .replace(/%([0-9A-F]{2})/g, (match) => match.toUpperCase());  // Uppercase encoding
}

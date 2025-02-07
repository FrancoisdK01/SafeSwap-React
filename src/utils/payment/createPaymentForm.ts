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

  // formData can be typed as strings, but we store merchant_id and custom_int1 as numbers for the signature
  const formData: Record<string, string> = {
    merchant_id: merchantId.toString(),
    merchant_key: config.merchant_key,
    // return_url: config.return_url,
    // cancel_url: config.cancel_url,
    // notify_url: config.notify_url,
    // name_first: userEmail.split('@')[0],
    // email_address: userEmail,
    // m_payment_id: transaction.safe_code,
    amount: transaction.price.toFixed(2),
    item_name: transaction.safe_code,
    // item_description: transaction.description,
    // custom_int1: customInt1.toString(),
    // custom_str1: 'NA',
    // custom_str2: 'NA',
    passphrase: config.passphrase
  };

  // Maintain the exact PayFast field order
  const fieldOrder = [
    'merchant_id',
    'merchant_key',
    // 'return_url',
    // 'cancel_url',
    // 'notify_url',
    // 'name_first',
    // 'email_address',
    // 'm_payment_id',
    'amount',
    'item_name',
    // 'item_description',
    // 'custom_int1',
    // 'custom_str1',
    // 'custom_str2',
    'passphrase'
  ];

  // Generate the signature string (without adding the passphrase again)
  const signatureString = fieldOrder
  .map((key) => `${key}=${formData[key]}`)
  .join('&');

  // Generate the MD5 signature
  const signature = md5(signatureString); // This is now using js-md5


  console.log('Signature String:', signatureString);
  console.log('Generated Signature:', signature);

  // Encode values for the final URL
  const encodedParams = fieldOrder
    .map((key) => `${key}=${encodeURIComponent(formData[key])}`)
    .join('&');

  // Final URL construction
  const finalUrl = `${config.is_sandbox ? config.sandbox_url : config.production_url}?${encodedParams}&signature=${signature}`;

  console.log('Final Payment URL:', finalUrl);

  return finalUrl;
}

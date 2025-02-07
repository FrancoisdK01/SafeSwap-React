// **This creates the form and a MD5 Hash to send through to Payfast as a post url contained in a button, see emailService **//

import { Transaction } from '../../types/transaction';
import { PayFastConfig } from './payfast';
import md5 from 'md5';

// Helper function to create payment URL for email
export function createPaymentUrl(
  config: PayFastConfig,
  transaction: Transaction,
  userEmail: string
): string {
  const formData = {
    merchant_id: config.merchant_id,
    merchant_key: config.merchant_key,
    return_url: config.return_url,
    cancel_url: config.cancel_url,
    notify_url: config.notify_url,
    name_first: userEmail.split('@')[0],
    email_address: userEmail,
    m_payment_id: transaction.buyer_id,
    amount: transaction.price.toFixed(2),
    item_name: transaction.safe_code,
    item_description: transaction.description,
    custom_int1: '0',
    custom_str1: ' ',
    custom_str2: ' '
  };

  const dataString = Object.entries(formData)
    .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
    .join('&');

  const signatureString = `${dataString}&passphrase=${encodeURIComponent(config.passphrase)}`;
  const signature = md5(signatureString);

   // Log the payload and signature for debugging
   console.log('Payload:', formData);
   console.log('Signature:', signature); 

  // Use the correct URL based on the sandbox flag
  const paymentUrl = config.is_sandbox
    ? config.sandbox_url
    : config.production_url;

  return `${paymentUrl}?${dataString}&signature=${signature}`;
}

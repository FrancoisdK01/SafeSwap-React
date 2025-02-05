import { PAYFAST_CONFIG } from '../config/payfast';
import { Transaction } from '../types/transaction';
import md5 from 'md5';

interface PayFastData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  signature: string;
}

export function generatePayFastForm(transaction: Transaction, userEmail: string): PayFastData {
  const data: Partial<PayFastData> = {
    merchant_id: PAYFAST_CONFIG.merchant_id,
    merchant_key: PAYFAST_CONFIG.merchant_key,
    return_url: PAYFAST_CONFIG.return_url,
    cancel_url: PAYFAST_CONFIG.cancel_url,
    notify_url: PAYFAST_CONFIG.notify_url,
    name_first: 'Test User',
    email_address: userEmail,
    m_payment_id: transaction.safe_code,
    amount: transaction.price.toFixed(2),
    item_name: transaction.description,
  };

  // Generate signature (alphabetically sorted)
  const signatureString = Object.entries(data)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([_, value]) => value)
    .join('') + PAYFAST_CONFIG.passphrase;

  data.signature = md5(signatureString);

  return data as PayFastData;
}
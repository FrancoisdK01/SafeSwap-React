import { Transaction } from '../../types/transaction';
import { PayFastConfig } from './payfast';
import { generateSignature } from './generateSignature';
import { PaymentFormData } from './types';

export function createPaymentForm(
  config: PayFastConfig, 
  transaction: Transaction, 
  userEmail: string
) {
  const baseData = {
    merchant_id: config.merchant_id,
    merchant_key: config.merchant_key,
    return_url: config.return_url,
    cancel_url: config.cancel_url,
    notify_url: config.notify_url,
    name_first: 'User Name',
    name_last: 'User Surname', 
    email_address: userEmail,
    m_payment_id: transaction.safe_code,
    amount: transaction.price.toFixed(2),
    item_name: transaction.description,
  };
  

  const signature = generateSignature(baseData, config.passphrase);
  const formData: PaymentFormData = { ...baseData, signature };
  const formUrl = config.is_sandbox ? config.sandbox_url : config.production_url;

  return { formUrl, formData };
}
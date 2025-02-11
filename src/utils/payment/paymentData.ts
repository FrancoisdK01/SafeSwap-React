// import { Transaction } from '../../types/transaction';
// import { PAYFAST_CONFIG } from './payfast';
// import { generateSignature } from './generateSignature';

// interface PayFastData {
//   merchant_id: string;
//   merchant_key: string;
//   return_url: string;
//   cancel_url: string;
//   notify_url: string;
//   name_first: string;
//   email_address: string;
//   m_payment_id: string;
//   amount: string;
//   item_name: string;
//   signature: string;
// }

// export function createPaymentData(transaction: Transaction, userEmail: string): PayFastData {
//   const data: Omit<PayFastData, 'signature'> = {
//     merchant_id: PAYFAST_CONFIG.merchant_id,
//     merchant_key: PAYFAST_CONFIG.merchant_key,
//     return_url: PAYFAST_CONFIG.return_url,
//     cancel_url: PAYFAST_CONFIG.cancel_url,
//     notify_url: PAYFAST_CONFIG.notify_url,
//     name_first: 'Test User',
//     email_address: userEmail,
//     m_payment_id: transaction.safe_code,
//     amount: transaction.price.toFixed(2),
//     item_name: transaction.description
//   };

//   const signature = generateSignature(data as Record<string, string>, PAYFAST_CONFIG.passphrase);

//   return {
//     ...data,
//     signature
//   };
// }
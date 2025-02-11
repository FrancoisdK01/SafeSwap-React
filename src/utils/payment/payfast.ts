
// This is the currently used Payfast Configuration interface object structure
// Used by emailservice.ts to generate the payment link sent via the EmailJS client 

export interface PayFastConfig {
  merchant_id: string;
  merchant_key: string;
  passphrase: string;
  sandbox_url: string;
  production_url: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  is_sandbox: boolean;
}

export const PAYFAST_CONFIG: PayFastConfig = {
  merchant_id: '10036981',
  merchant_key: 'wnhgjl9qn8d5i',
  passphrase: 'SafeSwapSaltPhrase102',
  production_url: 'https://www.payfast.co.za/eng/process',
  sandbox_url: 'https://sandbox.payfast.co.za/eng/process',
  return_url: `https://celebrated-pixie-6a4543.netlify.app/payment/success`,
  cancel_url: `https://celebrated-pixie-6a4543.netlify.app/payment/cancel`,
  notify_url: `https://celebrated-pixie-6a4543.netlify.app/.netlify/functions/paymentNotify`,  // Netlify function endpoint
  is_sandbox: true,
};


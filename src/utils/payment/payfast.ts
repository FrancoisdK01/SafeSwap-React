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
  is_local: boolean; // ✅ NEW: Toggle between local and public environments
}

// Base URLs
const LOCAL_BASE_URL = 'http://localhost:5173'; // ✅ Updated to use the correct Vite port
const PUBLIC_BASE_URL = 'https://celebrated-pixie-6a4543.netlify.app';

const IS_LOCAL = import.meta.env.VITE_IS_LOCAL === 'true'; // Convert string to boolean

export const PAYFAST_CONFIG: PayFastConfig = {
  merchant_id: '10036981',
  merchant_key: 'wnhgjl9qn8d5i',
  passphrase: 'SafeSwapSaltPhrase102',
  production_url: 'https://www.payfast.co.za/eng/process',
  sandbox_url: 'https://sandbox.payfast.co.za/eng/process',
  return_url: `${IS_LOCAL ? LOCAL_BASE_URL : PUBLIC_BASE_URL}/payment/success`,
  cancel_url: `${IS_LOCAL ? LOCAL_BASE_URL : PUBLIC_BASE_URL}/payment/cancel`,
  notify_url: `${IS_LOCAL ? LOCAL_BASE_URL : PUBLIC_BASE_URL}/.netlify/functions/paymentNotify`,
  is_sandbox: true,
  is_local: IS_LOCAL, // ✅ Now correctly evaluates as boolean
};
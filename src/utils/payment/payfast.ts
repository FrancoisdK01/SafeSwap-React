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
  merchant_id: '10036498',
  merchant_key: 'cy5ro7rmqbq32',
  passphrase: 'SafeSwapSaltPhrase101',
  production_url: 'https://www.payfast.co.za/eng/process',
  sandbox_url: 'https://sandbox.payfast.co.za/eng/process',
  return_url: `${window.location.origin}/payment/success`,
  cancel_url: `${window.location.origin}/payment/cancel`,
  notify_url: `${window.location.origin}/api/payment/notify`,
  is_sandbox: true,
};
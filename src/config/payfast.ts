export const PAYFAST_CONFIG = {
  merchant_id: '10036498',
  merchant_key: 'cy5ro7rmqbq32',
  passphrase: 'SafeSwapSaltPhrase101',
  sandbox_url: 'https://sandbox.payfast.co.za/eng/process',
  return_url: `${window.location.origin}/payment/success`,
  cancel_url: `${window.location.origin}/payment/cancel`,
  notify_url: `${window.location.origin}/api/payment/notify`,
  is_sandbox: true,
};

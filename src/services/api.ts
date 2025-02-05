const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function sendPaymentLink(email: string, transaction: any) {
  const response = await fetch(`${API_BASE_URL}/payment/send-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, transaction }),
  });

  if (!response.ok) {
    throw new Error('Failed to send payment link');
  }

  return response.json();
}
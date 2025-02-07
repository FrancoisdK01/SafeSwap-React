import emailjs from '@emailjs/browser';
import { Transaction } from '../types/transaction';
import { createPaymentUrl } from '../utils/payment/createPaymentForm';
import {PAYFAST_CONFIG } from '../utils/payment/payfast';
import { EMAILJS_CONFIG } from '../config/emailjs';

export async function sendPaymentLink(transaction: Transaction, email: string) {
  // Use the dynamic base URL based on is_sandbox
  const paymentUrl = createPaymentUrl({
    ...PAYFAST_CONFIG,
  }, transaction, email);

  console.log(paymentUrl);
  

  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        To_Email: email,
        safe_code: transaction.safe_code,
        item_name: transaction.description,
        amount: `R ${transaction.price.toFixed(2)}`,
        payment_url: paymentUrl,
        year: new Date().getFullYear().toString(),
      },
      EMAILJS_CONFIG.publicKey
    );

    return {
      success: true,
      message: `Payment link has been sent to ${email}`,
      response,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

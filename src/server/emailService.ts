import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export async function sendPaymentEmail(
  to: string,
  paymentUrl: string,
  transactionDetails: {
    safeCode: string;
    description: string;
    price: number;
  }
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `SafeSwap Payment Request: ${transactionDetails.description}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4299e1; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">SafeSwap Payment Request</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f7fafc;">
          <p>Hello,</p>
          <p>You have received a payment request for the following transaction:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>SafeCode:</strong> ${transactionDetails.safeCode}</p>
            <p><strong>Item:</strong> ${transactionDetails.description}</p>
            <p><strong>Amount:</strong> R ${transactionDetails.price.toFixed(2)}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${paymentUrl}" 
               style="background-color: #4299e1; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              Pay Now
            </a>
          </div>
          
          <p style="color: #718096; font-size: 14px;">
            This payment link will expire in 24 hours. If you have any questions, 
            please contact support.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #718096; font-size: 12px;">
          © ${new Date().getFullYear()} SafeSwap. All rights reserved.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
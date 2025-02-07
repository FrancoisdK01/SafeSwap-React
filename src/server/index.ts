import express, { Request, Response } from 'express';
import { sendPaymentEmail } from '../templates/emailService';
import { createPaymentForm } from '../utils/payment/createPaymentForm';
import { PAYFAST_CONFIG } from '../utils/payment/payfast';

const app = express();
app.use(express.json());

app.post('/api/payment/send-link', async (req: Request, res: Response) => {
  try {
    const { email, transaction } = req.body;
    
    const { formUrl, formData } = createPaymentForm(PAYFAST_CONFIG, transaction, email);
    const searchParams = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value);
      }
    });
    const paymentUrl = `${formUrl}?${searchParams.toString()}`;
    
    await sendPaymentEmail(email, paymentUrl, {
      safeCode: transaction.safe_code,
      description: transaction.description,
      price: transaction.price
    });
    
    res.json({ success: true, message: `Payment link sent to ${email}` });
  } catch (error) {
    console.error('Failed to process payment link request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send payment link' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
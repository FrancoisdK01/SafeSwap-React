import React from 'react';
import { Transaction } from '../../types/transaction';
import PayFastForm from './PayFastForm';

interface PaymentFormProps {
  transaction: Transaction;
  userEmail: string;
}

export default function PaymentForm({ transaction, userEmail }: PaymentFormProps) {
  return <PayFastForm transaction={transaction} userEmail={userEmail} />;
}
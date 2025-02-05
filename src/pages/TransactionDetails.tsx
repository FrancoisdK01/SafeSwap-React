import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTransactions } from '../contexts/TransactionContext';
import Header from '../components/Header';
import PaymentDetails from '../components/payment/PaymentDetails';
import SendPaymentLinkForm from '../components/payment/SendPaymentLinkForm';
import { Transaction } from '../types/transaction';

export default function TransactionDetails() {
  const { safeCode } = useParams();
  const { findTransactionBySafeCode } = useTransactions();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        if (!safeCode) return;
        const result = await findTransactionBySafeCode(safeCode);
        setTransaction(result);
      } catch (err) {
        setError('Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [safeCode, findTransactionBySafeCode]);

  if (loading) {
    return (
      <div className="flex-1">
        <Header title="Transaction Details" />
        <main className="p-4">
          <div className="text-center text-gray-500">Loading...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1">
        <Header title="Transaction Details" />
        <main className="p-4">
          <div className="text-center text-red-500">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header title="Transaction Details" />
      <main className="p-4 space-y-6">
        <PaymentDetails transaction={transaction} />
        {transaction && (
          <SendPaymentLinkForm 
            transaction={transaction}
            onSuccess={() => {
              // Optional: Add success handling
            }}
          />
        )}
      </main>
    </div>
  );
}
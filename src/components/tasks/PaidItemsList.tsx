import React from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import SatisfactionRating from './SatisfactionRating';
import { FaInfoCircle } from 'react-icons/fa';

export default function PaidItemsList() {
  const { transactions, addSatisfactionRating } = useTransactions();
  const paidItems = transactions.filter(t => t.status === 'paid' && !t.satisfaction_rating);

  if (paidItems.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No items awaiting confirmation
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Escrow Information Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              Your feedback helps us ensure a safe transaction for everyone. The seller's payment is held in escrow until:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>You confirm satisfaction with the received item</li>
              <li>If not satisfied, you'll need to return the item to initiate a refund</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Transaction Items */}
      {paidItems.map(transaction => (
        <div key={transaction.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h3 className="font-medium text-gray-800">{transaction.description}</h3>
            <p className="text-sm text-gray-500">SafeCode: {transaction.safe_code}</p>
            <p className="text-sm font-medium text-blue-500">
              R {transaction.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Have you received this item? Please let us know about your experience.
            </p>
            <SatisfactionRating 
              onRate={(isSatisfied, note) => addSatisfactionRating(transaction.id, isSatisfied, note)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
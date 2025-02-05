import React from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function ArchivedItemsList() {
  const { transactions } = useTransactions();
  const completedTransactions = transactions.filter(t => t.status === 'completed');

  if (completedTransactions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No completed transactions
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {completedTransactions.map(transaction => (
        <div key={transaction.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-800">{transaction.description}</h3>
              <p className="text-sm text-gray-500">SafeCode: {transaction.safe_code}</p>
              <p className="text-sm font-medium text-blue-500">
                R {transaction.price.toFixed(2)}
              </p>
            </div>
            {transaction.satisfaction_rating && (
              <div className={`flex items-center gap-2 ${
                transaction.satisfaction_rating.is_satisfied 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {transaction.satisfaction_rating.is_satisfied ? (
                  <>
                    <FaThumbsUp />
                    <span className="text-sm font-medium">Satisfied</span>
                  </>
                ) : (
                  <>
                    <FaThumbsDown />
                    <span className="text-sm font-medium">Not Satisfied</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          {transaction.satisfaction_rating?.note && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {transaction.satisfaction_rating.note}
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500">
            Completed on {transaction.satisfaction_rating?.rated_at ? 
              new Date(transaction.satisfaction_rating.rated_at).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Unknown date'}
          </div>
        </div>
      ))}
    </div>
  );
}
import React, { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import CopyButton from './CopyButton';
import DeleteTransactionButton from './transactions/DeleteTransactionButton';
import Toast from './common/Toast';
import { getTransactionStatusDisplay } from '../utils/transaction/statusDisplay';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDelete = async (id: string, status: string) => {
    try {
      if (status !== 'pending' && status !== 'returning') {
        setError('Only pending transactions or returns can be deleted');
        return;
      }
      
      await deleteTransaction(id);
      setSuccess('Transaction deleted successfully');
    } catch (err: any) {
      if (err.message?.includes('associated buyer')) {
        setError('Cannot delete - transaction has associated buyer records');
      } else if (err.message?.includes('Only pending transactions')) {
        setError(err.message);
      } else {
        setError('Failed to delete transaction');
      }
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
          duration={5000}
        />
      )}
      {success && (
        <Toast
          message={success}
          type="success" 
          onClose={() => setSuccess(null)}
          duration={3000}
        />
      )}

      {transactions.map(transaction => {
        const status = getTransactionStatusDisplay(transaction);
        
        return (
          <div
            key={transaction.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors relative"
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-gray-800">{transaction.description}</span>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">
                    R {transaction.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    {(transaction.status === 'pending' || transaction.status === 'returning') && (
                      <DeleteTransactionButton 
                        onDelete={() => handleDelete(transaction.id, transaction.status)}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                      />
                    )}
                    <CopyButton 
                      text={transaction.safe_code} 
                      label="Copy SafeCode" 
                      className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  SafeCode: {transaction.safe_code}
                </span>
                {transaction.is_pudo && (
                  <span className="text-sm text-blue-500">
                    PUDO Size: {transaction.locker_size}
                  </span>
                )}
              </div>
              <div className="absolute bottom-4 right-4">
                <span className={`text-sm ${status.color}`}>
                  {status.text}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {transactions.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No transactions yet
        </div>
      )}
    </div>
  );
}
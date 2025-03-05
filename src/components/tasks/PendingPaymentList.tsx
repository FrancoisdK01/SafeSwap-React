import React, { useState } from 'react';
import { useSearchHistory } from '../../contexts/SearchHistoryContext';
import { useTransactions } from '../../contexts/TransactionContext';
import SendPaymentLinkForm from '../payment/SendPaymentLinkForm';
import { FaTrash } from 'react-icons/fa';

export default function PendingPaymentList() {
  const { searchHistory, removeFromHistory } = useSearchHistory();
  const { updateTransactionStatus } = useTransactions();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handlePaymentSuccess = (transactionId: string) => {
    updateTransactionStatus(transactionId, 'paid');
    removeFromHistory(selectedItem!);
    setSelectedItem(null);
  };

  if (searchHistory.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No items awaiting payment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchHistory.map(item => (
        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-800">{item.transaction.description}</h3>
              <p className="text-sm text-gray-500">SafeCode: {item.transaction.safe_code}</p>
              <p className="text-sm font-medium text-blue-500">
                R {item.transaction.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeFromHistory(item.id)}
              className="text-red-500 hover:text-red-600 transition-colors p-2"
              title="Remove from history"
            >
              <FaTrash size={16} />
            </button>
          </div>

          {selectedItem === item.id ? (
            <div className="space-y-4">
              <SendPaymentLinkForm 
                transaction={item.transaction}
                onSuccess={() => setSelectedItem(null)}
              />
              {/* <button
                onClick={() => handlePaymentSuccess(item.transaction.id)}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg 
                  hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Simulate Payment Success
              </button> */}
            </div>
          ) : (
            <button
              onClick={() => setSelectedItem(item.id)}
              className="w-full mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium 
                hover:bg-blue-600 transition-colors text-sm"
            >
              Send Payment Link
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
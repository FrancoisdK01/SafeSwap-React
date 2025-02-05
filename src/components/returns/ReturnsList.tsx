import React from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaBox, FaCheck, FaTimes } from 'react-icons/fa';
import ConfirmDialog from '../common/ConfirmDialog';

interface ReturnsListProps {
  mode: 'buyer' | 'seller';
}

export default function ReturnsList({ mode }: ReturnsListProps) {
  const { user } = useAuth();
  const { transactions, updateTransactionStatus } = useTransactions();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<string | null>(null);

  const returns = transactions.filter(t => {
    if (mode === 'buyer') {
      return t.buyer_id === user?.id && t.status === 'returning';
    } else {
      return t.seller_id === user?.id && t.status === 'returning';
    }
  });

  const handleConfirmReturn = async (transactionId: string) => {
    try {
      await updateTransactionStatus(transactionId, 'refunded');
      setShowConfirm(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to confirm return:', error);
    }
  };

  if (returns.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No returns {mode === 'buyer' ? 'initiated' : 'to process'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {returns.map(transaction => (
        <div 
          key={transaction.id}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium text-gray-800">{transaction.description}</h3>
              <p className="text-sm text-gray-500">SafeCode: {transaction.safe_code}</p>
              <p className="text-sm font-medium text-blue-500">
                R {transaction.price.toFixed(2)}
              </p>
              {transaction.return_details?.reason && (
                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  Return reason: {transaction.return_details.reason}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {mode === 'seller' && !transaction.return_details?.confirmed_by_seller && (
                <>
                  <button
                    onClick={() => {
                      setSelectedTransaction(transaction.id);
                      setShowConfirm(true);
                    }}
                    className="p-2 text-green-500 hover:text-green-600"
                    title="Confirm Return"
                  >
                    <FaCheck size={20} />
                  </button>
                  <button
                    className="p-2 text-red-500 hover:text-red-600"
                    title="Reject Return"
                  >
                    <FaTimes size={20} />
                  </button>
                </>
              )}
              {transaction.return_details?.confirmed_by_seller && (
                <span className="text-green-500 flex items-center gap-1">
                  <FaCheck /> Confirmed
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaBox />
            <span>Return initiated on {new Date(transaction.return_details?.initiated_at || '').toLocaleDateString()}</span>
          </div>
        </div>
      ))}

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setSelectedTransaction(null);
        }}
        onConfirm={() => selectedTransaction && handleConfirmReturn(selectedTransaction)}
        title="Confirm Return"
        message="Have you received the returned item? This will process the refund to the buyer."
        confirmLabel="Confirm & Process Refund"
        confirmVariant="primary"
      />
    </div>
  );
}
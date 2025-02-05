import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FaSearch } from 'react-icons/fa';
import { useTransactions } from '../contexts/TransactionContext';
import { useSearchHistory } from '../contexts/SearchHistoryContext';
import Toast from '../components/common/Toast';

export default function Search() {
  const [safeCode, setSafeCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { findTransactionBySafeCode } = useTransactions();
  const { addToHistory } = useSearchHistory();
  const navigate = useNavigate();

  const handleSearch = async () => {
    setError('');
    setShowToast(false);
    setLoading(true);

    try {
      const transaction = await findTransactionBySafeCode(safeCode);
      
      if (!transaction) {
        setError('Transaction not found or no longer available for purchase.');
        return;
      }

      // Add to search history and navigate
      addToHistory(transaction);
      navigate(`/transactions/${transaction.safe_code}`);
    } catch (err) {
      setError('Failed to search for transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <Header title="SafeBuy" />
      <main className="p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ready to Buy?</h2>
          <p className="text-gray-600">
            Enter the SafeCode from your seller to view the listing and proceed with payment.
          </p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={safeCode}
              onChange={(e) => setSafeCode(e.target.value.toUpperCase())}
              placeholder="Enter SafeCode"
              className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-4 px-8 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </main>
    </div>
  );
}
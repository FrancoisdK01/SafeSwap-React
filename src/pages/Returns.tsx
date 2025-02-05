import React, { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import ReturnsList from '../components/returns/ReturnsList';
import NotificationBadge from '../components/common/NotificationBadge';

export default function Returns() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const { transactions } = useTransactions();
  const { user } = useAuth();

  // Count returns for each tab
  const buyerReturnsCount = transactions.filter(t => 
    t.buyer_id === user?.id && t.status === 'returning'
  ).length;

  const sellerReturnsCount = transactions.filter(t => 
    t.seller_id === user?.id && t.status === 'returning'
  ).length;

  return (
    <div className="flex-1">
      <Header title="SafeReturns" />
      <main className="p-4">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'buyer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Returns
            <NotificationBadge count={buyerReturnsCount} />
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'seller'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Return Requests
            <NotificationBadge count={sellerReturnsCount} />
          </button>
        </div>

        <ReturnsList mode={activeTab} />
      </main>
    </div>
  );
}
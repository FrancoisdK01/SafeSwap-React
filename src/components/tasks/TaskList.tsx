import React, { useState } from 'react';
import PendingPaymentList from './PendingPaymentList';
import PaidItemsList from './PaidItemsList';
import ArchivedItemsList from './ArchivedItemsList';
import { FaShoppingBag, FaBox, FaArchive, FaListUl } from 'react-icons/fa';
import { useSearchHistory } from '../../contexts/SearchHistoryContext';
import { useTransactions } from '../../contexts/TransactionContext';
import NotificationBadge from '../common/NotificationBadge';

export default function TaskList() {
  const [activeTab, setActiveTab] = useState<'pending' | 'received'>('pending');
  const [showArchive, setShowArchive] = useState(false);
  const { searchHistory } = useSearchHistory();
  const { transactions } = useTransactions();
  
  // Count pending payments (from search history)
  const pendingCount = searchHistory.length;

  // Count received items awaiting confirmation
  const receivedCount = transactions.filter(t => 
    t.status === 'paid' && !t.satisfaction_rating
  ).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-800">Tasks</h2>
        <button
          onClick={() => setShowArchive(!showArchive)}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showArchive ? <FaListUl /> : <FaArchive />}
          <span>{showArchive ? 'Tasks' : 'Archive'}</span>
        </button>
      </div>

      {showArchive ? (
        <>
          <p className="text-sm text-gray-600 mb-4">
            History of completed transactions
          </p>
          <ArchivedItemsList />
        </>
      ) : (
        <>
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaShoppingBag />
              <span>Awaiting Payment</span>
              {pendingCount > 0 && <NotificationBadge count={pendingCount} />}
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaBox />
              <span>Received Items</span>
              {receivedCount > 0 && <NotificationBadge count={receivedCount} />}
            </button>
          </div>

          <div className="mt-4">
            {activeTab === 'pending' && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Items you've searched that need payment
                </p>
                <PendingPaymentList />
              </>
            )}
            {activeTab === 'received' && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Please let us know if you received your items
                </p>
                <PaidItemsList />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
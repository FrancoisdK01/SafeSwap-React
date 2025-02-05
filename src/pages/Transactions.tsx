import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../contexts/TransactionContext';
import TransactionList from '../components/TransactionList';
import Header from '../components/Header';
import { FaPlus } from 'react-icons/fa';

export default function Transactions() {
  const navigate = useNavigate();
  const { loading, error } = useTransactions();

  if (loading) {
    return (
      <div className="flex-1">
        <Header title="SafeTransact" />
        <main className="p-4">
          <div className="text-center text-gray-500">Loading transactions...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1">
        <Header title="SafeTransact" />
        <main className="p-4">
          <div className="text-center text-red-500">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header title="SafeTransact" />
      <main className="p-4">
        <TransactionList />
      </main>
      <button 
        onClick={() => navigate('/transactions/create')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
        aria-label="New transaction"
      >
        <FaPlus size={20} />
      </button>
    </div>
  );
}
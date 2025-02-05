import React from 'react';
import TransactionForm from '../components/transactions/TransactionForm';
import Header from '../components/Header';

export default function CreateTransaction() {
  return (
    <div className="flex-1 bg-gray-50">
      <Header title="SafeTransact" />
      <main className="p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Create a Listing</h2>
          <p className="text-gray-600">
            Please add the listing details of the item you are selling. Once created, you'll receive a unique reference code to share with your buyer.
          </p>
        </div>
        <TransactionForm />
      </main>
    </div>
  );
}
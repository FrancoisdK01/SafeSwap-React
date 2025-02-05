import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import ImageSlider from './ImageSlider';

interface AccountDetail {
  label: string;
  value: string;
}

export default function AccountInfo() {
  const { transactions } = useTransactions();

  const details: AccountDetail[] = [
    { label: 'Active Transactions', value: transactions.length.toString() },
    { label: 'Funds in Holding Account', value: 'R 0.00' },
  ];

  return (
    <div className="space-y-4">
      {details.map((detail) => (
        <div 
          key={detail.label} 
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-sm text-gray-500 mb-1">{detail.label}</p>
          <p className="text-lg font-semibold text-gray-800">{detail.value}</p>
        </div>
      ))}
      
      <div className="mt-6">
        <ImageSlider />
      </div>
    </div>
  );
}
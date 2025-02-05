import React, { createContext, useContext, useState } from 'react';
import { Transaction } from '../types/transaction';
import * as transactionService from '../services/supabase/transactionService';
import Toast from '../components/common/Toast';

interface SearchHistoryItem {
  id: string;
  transaction: Transaction;
  searchedAt: Date;
}

interface SearchHistoryContextType {
  searchHistory: SearchHistoryItem[];
  addToHistory: (transaction: Transaction) => Promise<void>;
  removeFromHistory: (id: string) => void;
}

const SearchHistoryContext = createContext<SearchHistoryContextType | undefined>(undefined);

export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addToHistory = async (transaction: Transaction) => {
    try {
      // Create buyer transaction in database
      await transactionService.createBuyerTransaction(transaction.safe_code);

      setSearchHistory(prev => [{
        id: crypto.randomUUID(),
        transaction,
        searchedAt: new Date()
      }, ...prev]);
    } catch (error: any) {
      setError(error.message || 'Failed to add transaction to history');
      setTimeout(() => setError(null), 3000);
      throw error;
    }
  };

  const removeFromHistory = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <SearchHistoryContext.Provider value={{ searchHistory, addToHistory, removeFromHistory }}>
      {children}
      {error && (
        <Toast
          header='Bad SafeCode'
          subHeader='Use new SafeCode'
          type="error"
          onClose={() => setError(null)}
          duration={3000}
        />
      )}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
  }
  return context;
}
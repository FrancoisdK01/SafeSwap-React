import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '../types/transaction';
import { useAuth } from './AuthContext';
import * as transactionService from '../services/supabase/transactionService';
import Toast from '../components/common/Toast';

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'safe_code' | 'created_at' | 'status' | 'seller_id'>) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  findTransactionBySafeCode: (safeCode: string) => Promise<Transaction | null>;
  updateTransactionStatus: (id: string, status: Transaction['status']) => Promise<void>;
  addSatisfactionRating: (id: string, isSatisfied: boolean, note?: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTransactions();
    } else {
      setTransactions([]);
      setLoading(false);
      setError(null);
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getUserTransactions();
      setTransactions(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load transactions';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (newTransaction: Omit<Transaction, 'id' | 'safe_code' | 'created_at' | 'status' | 'seller_id'>) => {
    try {
      const transaction = await transactionService.createTransaction(newTransaction);
      await loadTransactions();
      return transaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create transaction';
      setError(message);
      throw new Error(message);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete transaction';
      setError(message);
      throw new Error(message);
    }
  };

  const findTransactionBySafeCode = async (safeCode: string) => {
    try {
      return await transactionService.findTransactionBySafeCode(safeCode);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to find transaction';
      setError(message);
      return null;
    }
  };

  const updateTransactionStatus = async (id: string, status: Transaction['status']) => {
    try {
      await transactionService.updateTransactionStatus(id, status);
      await loadTransactions();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update transaction status';
      setError(message);
      throw new Error(message);
    }
  };

  const addSatisfactionRating = async (id: string, isSatisfied: boolean, note?: string) => {
    try {
      await transactionService.addSatisfactionRating(id, isSatisfied, note);
      
      // If not satisfied, delete the transaction
      if (!isSatisfied) {
        await deleteTransaction(id);
      }
      
      await loadTransactions();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add satisfaction rating';
      setError(message);
      throw new Error(message);
    }
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      loading,
      error,
      addTransaction,
      deleteTransaction,
      findTransactionBySafeCode,
      updateTransactionStatus,
      addSatisfactionRating,
    }}>
      {children}
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
          duration={3000}
        />
      )}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
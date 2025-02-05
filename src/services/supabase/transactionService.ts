import { supabase } from '../../config/supabase';
import { Transaction } from '../../types/transaction';
import { generateSafeCode } from '../../utils/transaction/safeCode';

export async function getUserTransactions(): Promise<Transaction[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'safe_code' | 'created_at' | 'status' | 'seller_id'>): Promise<Transaction> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  const safeCode = generateSafeCode();
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      ...transaction,
      safe_code: safeCode,
      seller_id: user.id,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function findTransactionBySafeCode(safeCode: string): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, satisfaction_rating')
    .eq('safe_code', safeCode)
    .is('satisfaction_rating->is_satisfied', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }

  return data;
}

export async function updateTransactionStatus(id: string, status: Transaction['status']): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

export async function addSatisfactionRating(id: string, isSatisfied: boolean, note?: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .update({
      satisfaction_rating: {
        is_satisfied: isSatisfied,
        note,
        rated_at: new Date().toISOString()
      },
      status: isSatisfied ? 'completed' : 'returning'
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createBuyerTransaction(safeCode: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  const { data: transaction, error: findError } = await supabase
    .from('transactions')
    .select('id')
    .eq('safe_code', safeCode)
    .single();

  if (findError) throw findError;
  if (!transaction) throw new Error('Transaction not found');

  const { error } = await supabase
    .from('buyer_transactions')
    .insert({
      original_transaction_id: transaction.id,
      buyer_id: user.id,
      safe_code: safeCode,
      status: 'pending'
    });

  if (error) throw error;
}
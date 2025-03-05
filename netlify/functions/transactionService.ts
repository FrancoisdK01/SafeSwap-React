import { supabase } from './supabaseClient';
import { Transaction } from './Transaction';


export async function updateTransactionStatus(id: string, status: Transaction['status']): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}
import { supabase } from './supabaseClient';
import { Transaction } from './Transaction';

export async function updateTransactionStatus(id: string, status: Transaction['status']): Promise<void> {
  console.log(`🔄 Updating transaction ${id} to status: ${status}`);

  // ✅ Update transactions table
  const { error: transactionError } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', id);

  if (transactionError) {
    console.error(`❌ Supabase update failed for transactions table:`, transactionError);
    throw transactionError;
  }

  // ✅ Update buyer_transactions table
  const { error: buyerTransactionError } = await supabase
    .from('buyer_transactions')
    .update({ status })
    .eq('original_transaction_id', id);

  if (buyerTransactionError) {
    console.error(`❌ Supabase update failed for buyer_transactions table:`, buyerTransactionError);
    throw buyerTransactionError;
  }

  console.log(`✅ Transaction ${id} successfully updated in both tables.`);
}

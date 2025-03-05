import { supabase } from './supabaseClient';
import { Transaction } from './Transaction';

export async function updateTransactionStatus(id: string, status: string): Promise<void> {
    console.log(`🔄 Attempting to update transaction ${id} to status: ${status}`);
  
    // ✅ Update transactions table
    const { data, error: transactionError } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', id)
      .select();  // ✅ Ensure we get affected rows for debugging
  
    if (transactionError) {
      console.error(`❌ Supabase update failed for transactions:`, transactionError);
      throw transactionError;
    }
  
    console.log(`🔄 Rows affected in transactions:`, data);
  
    // ✅ Update buyer_transactions table
    const { data: buyerData, error: buyerTransactionError } = await supabase
      .from('buyer_transactions')
      .update({ status })
      .eq('original_transaction_id', id)
      .select();  // ✅ Ensure we get affected rows for debugging
  
    if (buyerTransactionError) {
      console.error(`❌ Supabase update failed for buyer_transactions:`, buyerTransactionError);
      throw buyerTransactionError;
    }
  
    console.log(`🔄 Rows affected in buyer_transactions:`, buyerData);
  
    console.log(`✅ Transaction ${id} successfully updated in both tables.`);
  }
  

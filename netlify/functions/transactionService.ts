import { supabaseAdmin } from './supabaseClient';

export async function updateTransactionStatus(id: string, status: string): Promise<void> {
  console.log(`🔄 Attempting to update transaction ${id} to status: ${status}`);

  // ✅ Use supabaseAdmin to bypass RLS and ensure the update works
  const { data, error: transactionError } = await supabaseAdmin
    .from('transactions')
    .update({ status })
    .eq('id', id)
    .select(); // ✅ Ensure affected rows are logged

  if (transactionError) {
    console.error(`❌ Supabase update failed for transactions:`, transactionError);
    throw transactionError;
  }

  console.log(`🔄 Rows affected in transactions:`, data);

  // ✅ Update buyer_transactions table
  const { data: buyerData, error: buyerTransactionError } = await supabaseAdmin
    .from('buyer_transactions')
    .update({ status })
    .eq('original_transaction_id', id)
    .select(); // ✅ Ensure affected rows are logged

  if (buyerTransactionError) {
    console.error(`❌ Supabase update failed for buyer_transactions:`, buyerTransactionError);
    throw buyerTransactionError;
  }

  console.log(`🔄 Rows affected in buyer_transactions:`, buyerData);
  console.log(`✅ Transaction ${id} successfully updated.`);
}

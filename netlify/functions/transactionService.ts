import { supabase } from './supabaseClient';

export async function updateTransactionStatus(id: string, status: string): Promise<void> {
  const { data: user, error: userError } = await supabase.auth.getUser();
  console.log('🔍 Authenticated User:', user);

  if (userError || !user) {
    console.error('❌ No authenticated user found. Updates may be blocked by RLS.');
  }

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

  const { data: existingTransaction, error: fetchError } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id);
  console.log(`🔍 Existing Transaction Data:`, existingTransaction);
  if (fetchError) console.error('❌ Error fetching transaction:', fetchError);


  console.log(`🔄 Rows affected in buyer_transactions:`, buyerData);

  console.log(`✅ Transaction ${id} successfully updated in both tables.`);

  console.log(`🔍 Checking data type of id: ${typeof id}`);
}


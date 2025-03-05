import { supabase } from "./supabaseClient";

/**
 * Updates the transaction status in the database
 */
export async function updateTransactionStatus(transactionId: string, status: string) {
  const { data, error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', transactionId)
    .select();

  if (error) {
    console.error('❌ Error updating transaction:', error);
    return null;
  }

  console.log('✅ Transaction updated:', data);
  return data;
}

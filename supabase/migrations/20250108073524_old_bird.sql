-- First drop all existing delete policies to avoid conflicts
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own pending transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete pending or returning transactions" ON transactions;

-- Create single unified delete policy with unique name
CREATE POLICY "transaction_delete_policy_v3"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    seller_id = auth.uid() AND (
      status = 'pending' OR 
      status = 'returning'
    )
  );
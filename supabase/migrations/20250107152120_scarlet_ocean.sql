/*
  # Cascade Delete for Pending Transactions
  
  1. Changes
    - Modify buyer_transactions foreign key to CASCADE on delete
    - Add trigger to handle transaction deletion logic
    - Update transaction delete policy
  
  2. Security
    - Only pending transactions can be deleted
    - Cascade delete only applies to pending buyer transactions
*/

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS before_transaction_delete ON transactions;
DROP FUNCTION IF EXISTS handle_transaction_delete();

-- Create function to handle transaction deletion
CREATE OR REPLACE FUNCTION handle_transaction_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow deletion of pending transactions
  IF OLD.status = 'pending' THEN
    -- Delete associated pending buyer transactions
    DELETE FROM buyer_transactions 
    WHERE original_transaction_id = OLD.id 
    AND status = 'pending';
    RETURN OLD;
  ELSE
    RAISE EXCEPTION 'Only pending transactions can be deleted';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for transaction deletion
CREATE TRIGGER before_transaction_delete
  BEFORE DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_transaction_delete();

-- Update foreign key constraint to CASCADE
ALTER TABLE buyer_transactions 
  DROP CONSTRAINT IF EXISTS buyer_transactions_original_transaction_id_fkey,
  ADD CONSTRAINT buyer_transactions_original_transaction_id_fkey 
    FOREIGN KEY (original_transaction_id) 
    REFERENCES transactions(id) 
    ON DELETE CASCADE;

-- Update delete policy
DROP POLICY IF EXISTS "Users can delete own pending transactions" ON transactions;
CREATE POLICY "Users can delete own pending transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    seller_id = auth.uid() AND 
    status = 'pending'
  );
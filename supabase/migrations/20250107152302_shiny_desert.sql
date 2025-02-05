/*
  # Fix Cascade Delete for Pending Transactions
  
  1. Changes
    - Drop existing triggers and constraints
    - Implement proper cascade delete for pending transactions
    - Prevent deletion of non-pending transactions
    - Add proper foreign key constraints
  
  2. Security
    - Only pending transactions can be deleted
    - Only seller can delete their own transactions
    - Cascade delete only applies to pending buyer transactions
*/

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS before_transaction_delete ON transactions;
DROP FUNCTION IF EXISTS handle_transaction_delete();
DROP TRIGGER IF EXISTS update_buyer_transactions_updated_at ON buyer_transactions;

-- Create function to handle transaction deletion
CREATE OR REPLACE FUNCTION handle_transaction_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow deletion of pending transactions
  IF OLD.status != 'pending' THEN
    RAISE EXCEPTION 'Only pending transactions can be deleted';
  END IF;

  -- Delete associated pending buyer transactions
  DELETE FROM buyer_transactions 
  WHERE original_transaction_id = OLD.id 
  AND status = 'pending';
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for transaction deletion
CREATE TRIGGER before_transaction_delete
  BEFORE DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_transaction_delete();

-- Update foreign key constraint
ALTER TABLE buyer_transactions 
  DROP CONSTRAINT IF EXISTS buyer_transactions_original_transaction_id_fkey;

ALTER TABLE buyer_transactions 
  ADD CONSTRAINT buyer_transactions_original_transaction_id_fkey 
  FOREIGN KEY (original_transaction_id) 
  REFERENCES transactions(id)
  ON DELETE CASCADE;

-- Update transaction delete policy
DROP POLICY IF EXISTS "Users can delete own pending transactions" ON transactions;
CREATE POLICY "Users can delete own pending transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    seller_id = auth.uid() 
    AND status = 'pending'
  );

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_buyer_transactions_updated_at
  BEFORE UPDATE ON buyer_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
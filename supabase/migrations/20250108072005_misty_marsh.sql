-- Drop existing function and recreate with proper conditions
DROP FUNCTION IF EXISTS handle_transaction_delete CASCADE;

CREATE OR REPLACE FUNCTION handle_transaction_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow deletion for pending transactions or transactions with status 'returning'
  IF OLD.status = 'pending' OR OLD.status = 'returning' THEN
    -- Delete associated buyer transactions
    DELETE FROM buyer_transactions 
    WHERE original_transaction_id = OLD.id;
    RETURN OLD;
  ELSE
    RAISE EXCEPTION 'Only pending transactions or returns can be deleted';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER before_transaction_delete
  BEFORE DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_transaction_delete();

-- Update transaction delete policy
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    seller_id = auth.uid() AND (
      status = 'pending' OR 
      status = 'returning'
    )
  );
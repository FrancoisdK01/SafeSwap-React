-- Drop existing policies and function
DROP POLICY IF EXISTS "transaction_delete_policy_v3" ON transactions;
DROP FUNCTION IF EXISTS handle_transaction_delete CASCADE;

-- Create updated transaction deletion function
CREATE OR REPLACE FUNCTION handle_transaction_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow deletion for pending or returning transactions
  IF OLD.status IN ('pending', 'returning') THEN
    -- Delete associated buyer transactions
    DELETE FROM buyer_transactions 
    WHERE original_transaction_id = OLD.id;
    RETURN OLD;
  ELSE
    RAISE EXCEPTION 'Only pending transactions or returns can be deleted';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for transaction deletion
CREATE TRIGGER before_transaction_delete
  BEFORE DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_transaction_delete();

-- Create new unified delete policy
CREATE POLICY "transaction_delete_policy_v4"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    seller_id = auth.uid() AND 
    status IN ('pending', 'returning')
  );
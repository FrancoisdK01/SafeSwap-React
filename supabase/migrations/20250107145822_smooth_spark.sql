  /*
    # Add delete restrictions for transactions
    
    1. Changes
      - Add ON DELETE RESTRICT to buyer_transactions foreign key
      - Update delete policies to prevent deletion of transactions with buyers
      - Add check to ensure only pending transactions can be deleted
  */
  
  -- First modify the buyer_transactions table to use RESTRICT
  ALTER TABLE buyer_transactions 
    DROP CONSTRAINT buyer_transactions_original_transaction_id_fkey,
    ADD CONSTRAINT buyer_transactions_original_transaction_id_fkey 
      FOREIGN KEY (original_transaction_id) 
      REFERENCES transactions(id) 
      ON DELETE RESTRICT;
  
  -- Update delete policy for transactions
  DROP POLICY IF EXISTS "Users can delete own pending transactions" ON transactions;
  CREATE POLICY "Users can delete own pending transactions"
    ON transactions FOR DELETE
    TO authenticated
    USING (
      seller_id = auth.uid() AND 
      status = 'pending' AND
      NOT EXISTS (
        SELECT 1 FROM buyer_transactions 
        WHERE original_transaction_id = transactions.id
      )
    );
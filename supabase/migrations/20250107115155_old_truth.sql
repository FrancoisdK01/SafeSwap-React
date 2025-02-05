/*
  # Make seller_id optional in transactions table
  
  1. Changes
    - Make seller_id column nullable
    - Update transaction policies to handle null seller_id
  
  2. Security
    - Maintain existing RLS policies
    - Add policy for transactions without seller_id
*/

-- Make seller_id nullable
ALTER TABLE transactions ALTER COLUMN seller_id DROP NOT NULL;

-- Update policies to handle null seller_id
CREATE POLICY "Users can view transactions without seller"
  ON transactions FOR SELECT
  TO authenticated
  USING (seller_id IS NULL);

-- Update existing policy
DROP POLICY IF EXISTS "Users can create transactions" ON transactions;
CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);
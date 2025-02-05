/*
  # Fix Transaction Policies
  
  1. Changes
    - Remove recursive policy for buyers
    - Add separate policies for different operations
    - Simplify access rules
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Sellers can manage their transactions" ON transactions;
DROP POLICY IF EXISTS "Buyers can view their transactions" ON transactions;

-- Create new policies
CREATE POLICY "Users can view own transactions as seller"
  ON transactions FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Users can view own transactions as buyer"
  ON transactions FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Users can view transactions by safecode"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Users can update own transactions as seller"
  ON transactions FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Users can update own transactions as buyer"
  ON transactions FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid());
/*
  # Add buyer transactions table and update transaction flow

  1. New Tables
    - `buyer_transactions`
      - Links buyers to original transactions
      - Tracks buyer-specific status
      - Enables separate payment tracking per buyer

  2. Security
    - Enable RLS
    - Add policies for buyer access
*/

-- Create buyer transactions table
CREATE TABLE buyer_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES auth.users(id),
  safe_code text NOT NULL,
  status transaction_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT buyer_transactions_safe_code_buyer_unique UNIQUE (safe_code, buyer_id)
);

-- Enable RLS
ALTER TABLE buyer_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Buyers can view their transactions"
  ON buyer_transactions FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Buyers can create transactions"
  ON buyer_transactions FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update their transactions"
  ON buyer_transactions FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_buyer_transactions_updated_at
  BEFORE UPDATE ON buyer_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
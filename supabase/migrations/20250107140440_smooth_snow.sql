/*
  # Add buyer transactions table

  1. New Tables
    - `buyer_transactions`
      - `id` (uuid, primary key)
      - `original_transaction_id` (uuid, references transactions)
      - `buyer_id` (uuid, references auth.users)
      - `safe_code` (text)
      - `status` (transaction_status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `buyer_transactions` table
    - Add policies for buyers to manage their transactions
*/

-- Create buyer transactions table
CREATE TABLE buyer_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_transaction_id uuid REFERENCES transactions(id),
  buyer_id uuid REFERENCES auth.users(id),
  safe_code text NOT NULL,
  status transaction_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT buyer_transactions_safe_code_key UNIQUE (safe_code, buyer_id)
);

-- Enable RLS
ALTER TABLE buyer_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Buyers can manage their transactions"
  ON buyer_transactions FOR ALL
  TO authenticated
  USING (buyer_id = auth.uid());

-- Create updated_at trigger
CREATE TRIGGER update_buyer_transactions_updated_at
  BEFORE UPDATE ON buyer_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
/*
  # Initialize Database Schema
  
  1. New Tables
    - profiles: User profile information
      - id (uuid, PK)
      - email (text)
      - is_verified (boolean)
      - verification_status (enum)
    - transactions: Transaction records
      - id (uuid, PK)
      - safe_code (text)
      - description (text)
      - price (numeric)
      - is_pudo (boolean)
      - status (enum)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Create enums
CREATE TYPE verification_status AS ENUM ('pending', 'submitted', 'verified', 'rejected');
CREATE TYPE transaction_status AS ENUM ('pending', 'paid', 'completed', 'disputed');

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_verified boolean DEFAULT false,
  verification_status verification_status DEFAULT 'pending',
  CONSTRAINT profiles_email_key UNIQUE (email)
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  safe_code text UNIQUE NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  is_pudo boolean DEFAULT false,
  locker_size text,
  status transaction_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  seller_id uuid REFERENCES auth.users(id) NOT NULL,
  buyer_id uuid REFERENCES auth.users(id),
  satisfaction_rating jsonb,
  CONSTRAINT valid_satisfaction_rating CHECK (
    satisfaction_rating IS NULL OR (
      satisfaction_rating ? 'is_satisfied' AND
      satisfaction_rating ? 'rated_at'
    )
  )
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Sellers can manage their transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Buyers can view their transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    buyer_id = auth.uid() OR
    safe_code IN (
      SELECT t.safe_code
      FROM transactions t
      WHERE t.buyer_id = auth.uid()
    )
  );

-- Create trigger for new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
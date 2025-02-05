/*
  # Fix Database Schema and Policies

  1. Changes
    - Drop all existing tables and types
    - Recreate schema with proper constraints
    - Set up correct RLS policies
    - Fix infinite recursion issue
*/

-- Drop existing objects
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;

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

-- Create profile policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create transaction policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    seller_id = auth.uid() OR 
    buyer_id = auth.uid() OR 
    safe_code IS NOT NULL
  );

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid() OR buyer_id = auth.uid());

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid());

-- Create profile trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
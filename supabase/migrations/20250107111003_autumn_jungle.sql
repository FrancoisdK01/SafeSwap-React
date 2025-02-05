-- Add new status values to transaction_status enum
ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'returning';
ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'returned';
ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'refunded';

-- Add return_details column to transactions table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transactions' 
    AND column_name = 'return_details'
  ) THEN
    ALTER TABLE transactions ADD COLUMN return_details jsonb;
  END IF;
END $$;
/*
  # Add Returns Support

  1. Changes
    - Add new status values to transaction_status enum
    - Add return_details column to transactions table
  
  2. Details
    - New status values: 'returning', 'returned', 'refunded'
    - return_details structure:
      - initiated_at: timestamp when return was initiated
      - reason: text explaining why return was initiated
      - confirmed_by_seller: boolean indicating seller confirmation
      - confirmed_at: timestamp when seller confirmed return
*/

-- Add new status values to transaction_status enum
ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'returning';
ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'returned';
ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'refunded';

-- Add return_details column to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS return_details jsonb;

-- Add constraint to validate return_details structure
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS valid_return_details;
ALTER TABLE transactions ADD CONSTRAINT valid_return_details CHECK (
  return_details IS NULL OR (
    return_details ? 'initiated_at' AND
    return_details ? 'reason' AND
    return_details ? 'confirmed_by_seller'
  )
);
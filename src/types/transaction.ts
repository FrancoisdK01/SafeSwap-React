export type TransactionStatus = 'pending' | 'paid' | 'completed' | 'disputed' | 'returning' | 'returned' | 'refunded';

export interface Transaction {
  id: string;
  safe_code: string;
  description: string;
  price: number;
  is_pudo: boolean;
  locker_size?: string;
  created_at: Date;
  status: TransactionStatus;
  seller_id: string;
  buyer_id?: string;
  satisfaction_rating?: {
    is_satisfied: boolean;
    note?: string;
    rated_at: Date;
  };
  return_details?: {
    initiated_at: Date;
    reason: string;
    confirmed_by_seller?: boolean;
    confirmed_at?: Date;
  };
}
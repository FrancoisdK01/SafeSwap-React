import { Transaction } from '../../types/transaction';

export function getTransactionStatusDisplay(transaction: Transaction) {
  switch (transaction.status) {
    case 'pending':
      return { text: 'Awaiting Payment', color: 'text-orange-500' };
    case 'paid':
      return { text: 'Payment Received', color: 'text-blue-500' };
    case 'returning':
      return { text: 'Not Satisfied - Return Initiated', color: 'text-red-500' };
    case 'completed':
      if (transaction.satisfaction_rating) {
        return {
          text: transaction.satisfaction_rating.is_satisfied ? 'Satisfied' : 'Not Satisfied',
          color: transaction.satisfaction_rating.is_satisfied ? 'text-green-500' : 'text-red-500'
        };
      }
      return { text: 'Completed', color: 'text-green-500' };
    default:
      return { text: transaction.status, color: 'text-gray-500' };
  }
}
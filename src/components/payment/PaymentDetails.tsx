import { Transaction } from '../../types/transaction';

interface PaymentDetailsProps {
  transaction: Transaction | null;
}

export default function PaymentDetails({ transaction }: PaymentDetailsProps) {
  if (!transaction) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="text-center text-gray-500">Transaction not found</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">SafeCode</span>
          <span className="font-medium">{transaction.safe_code}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Description</span>
          <span className="font-medium">{transaction.description}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount</span>
          <span className="font-medium">R {transaction.price.toFixed(2)}</span>
        </div>
        {transaction.is_pudo && (
          <div className="flex justify-between">
            <span className="text-gray-600">PUDO Size</span>
            <span className="font-medium">{transaction.locker_size}</span>
          </div>
        )}
      </div>
    </div>
  );
}
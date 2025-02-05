import React from 'react';
import { FaCreditCard, FaLock } from 'react-icons/fa';

interface PaymentButtonProps {
  onPayment: () => void;
}

export default function PaymentButton({ onPayment }: PaymentButtonProps) {
  return (
    <button 
      onClick={onPayment}
      className="w-full bg-blue-500 text-white py-4 px-8 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
    >
      <FaCreditCard />
      <span>Proceed to Payment</span>
      <FaLock className="ml-2" />
    </button>
  );
}
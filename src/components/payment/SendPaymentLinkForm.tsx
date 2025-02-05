import React, { useState } from 'react';
import { Transaction } from '../../types/transaction';
import { sendPaymentLink } from '../../services/emailService';
import { FaEnvelope } from 'react-icons/fa';

interface SendPaymentLinkFormProps {
  transaction: Transaction;
  onSuccess?: () => void;
}

export default function SendPaymentLinkForm({ transaction, onSuccess }: SendPaymentLinkFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const result = await sendPaymentLink(transaction, email);
      setStatus('success');
      setMessage(result.message);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to send payment link. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter buyer's email"
          required
        />
      </div>

      {message && (
        <p className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium 
          hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 
          disabled:opacity-50 text-sm"
      >
        <FaEnvelope />
        <span>
          {status === 'sending' ? 'Sending...' : 'Send Payment Link'}
        </span>
      </button>
    </form>
  );
}
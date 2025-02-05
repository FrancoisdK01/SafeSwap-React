import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../../contexts/TransactionContext';
import Toast from '../common/Toast';

export default function TransactionForm() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    description: '',
    price: '',
    is_pudo: false,
    locker_size: 'S'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.description || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price');
      }

      const transaction = await addTransaction({
        description: formData.description,
        price,
        is_pudo: formData.is_pudo,
        locker_size: formData.is_pudo ? formData.locker_size : undefined
      });

      navigate('/transactions', { 
        state: { 
          message: `Transaction created successfully! SafeCode: ${transaction.safe_code}` 
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setFormData({ ...formData, price: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
          duration={5000}
        />
      )}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price (ZAR)
        </label>
        <input
          type="text"
          id="price"
          value={formData.price}
          onChange={handlePriceChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
          disabled={loading}
          placeholder="0.00"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
}
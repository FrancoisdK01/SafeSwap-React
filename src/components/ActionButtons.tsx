import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTag } from 'react-icons/fa';

export default function ActionButtons() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-24 left-0 right-0 px-4 mx-auto max-w-lg">
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/search')}
          className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl font-medium 
            hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center justify-center gap-2 
            text-base shadow-lg touch-manipulation"
        >
          <FaShoppingCart />
          <span>Buying?</span>
        </button>
        <button
          onClick={() => navigate('/transactions/create')}
          className="flex-1 bg-green-500 text-white py-3 px-4 rounded-xl font-medium 
            hover:bg-green-600 active:bg-green-700 transition-colors flex items-center justify-center gap-2 
            text-base shadow-lg touch-manipulation"
        >
          <FaTag />
          <span>Selling?</span>
        </button>
      </div>
    </div>
  );
}
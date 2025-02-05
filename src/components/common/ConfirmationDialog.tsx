import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant: 'success' | 'danger';
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmVariant
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const icon = confirmVariant === 'success' 
    ? <FaCheckCircle className="text-green-500 text-3xl" />
    : <FaExclamationTriangle className="text-red-500 text-3xl" />;

  const buttonClass = confirmVariant === 'success'
    ? 'bg-green-500 hover:bg-green-600'
    : 'bg-red-500 hover:bg-red-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <div className="flex flex-col items-center text-center mb-6">
          {icon}
          <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${buttonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
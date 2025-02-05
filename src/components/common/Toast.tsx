import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface ToastProps {
  header?: string;
  subHeader?: string;
  message?: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ header, subHeader, message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-sm ${
        type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}>
        {/* Icon */}
        <div className="flex-shrink-0">
          {type === 'success' ? <FaCheckCircle className="text-green-500" /> : <FaExclamationCircle className="text-red-500" />}
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
          {header && <strong className="text-lg">{header}</strong>}
          {subHeader && <p className="text-sm opacity-80">{subHeader}</p>}
          {!header && !subHeader && <p className="text-sm">{message}</p>}
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import ConfirmDialog from '../common/ConfirmDialog';

interface DeleteTransactionButtonProps {
  onDelete: () => void;
  className?: string;
}

export default function DeleteTransactionButton({ onDelete, className = '' }: DeleteTransactionButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className={className}
        title="Delete transaction"
      >
        <FaTrash className="text-base" />
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          onDelete();
          setShowConfirm(false);
        }}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone. Only pending transactions without buyers can be deleted."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </>
  );
}
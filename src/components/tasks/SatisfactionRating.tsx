import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import ConfirmationDialog from '../common/ConfirmationDialog';

interface SatisfactionRatingProps {
  onRate: (isSatisfied: boolean, note?: string) => void;
}

export default function SatisfactionRating({ onRate }: SatisfactionRatingProps) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingRating, setPendingRating] = useState<{isSatisfied: boolean, note?: string} | null>(null);

  const handleRate = (isSatisfied: boolean) => {
    if (!isSatisfied) {
      setShowNote(true);
    } else {
      setPendingRating({ isSatisfied: true });
      setShowConfirmation(true);
    }
  };

  const handleSubmitNote = () => {
    if (!note.trim()) {
      alert('Please provide a reason for your dissatisfaction');
      return;
    }
    setPendingRating({ isSatisfied: false, note });
    setShowConfirmation(true);
    setShowNote(false);
  };

  const handleConfirm = () => {
    if (pendingRating) {
      onRate(pendingRating.isSatisfied, pendingRating.note);
    }
    setShowConfirmation(false);
    setPendingRating(null);
  };

  if (showNote) {
    return (
      <div className="space-y-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Please explain why you're not satisfied..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          required
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowNote(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitNote}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4">
        <button
          onClick={() => handleRate(true)}
          className="flex-1 flex items-center justify-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
          aria-label="Satisfied"
        >
          <FaThumbsUp size={24} />
        </button>
        <button
          onClick={() => handleRate(false)}
          className="flex-1 flex items-center justify-center p-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
          aria-label="Not Satisfied"
        >
          <FaThumbsDown size={24} />
        </button>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        title={pendingRating?.isSatisfied ? "Confirm Satisfaction" : "Initiate Return"}
        message={
          pendingRating?.isSatisfied
            ? "By confirming your satisfaction, the payment will be released to the seller and the transaction will be completed. This action cannot be undone."
            : "By reporting dissatisfaction, you'll need to return the item to get a refund. The seller will need to confirm receipt of the returned item before the refund is processed."
        }
        confirmLabel={pendingRating?.isSatisfied ? "Confirm & Release Payment" : "Confirm & Start Return"}
        confirmVariant={pendingRating?.isSatisfied ? "success" : "danger"}
      />
    </>
  );
}
import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

interface SatisfactionRatingProps {
  onRate: (isSatisfied: boolean, note?: string) => void;
}

export default function SatisfactionRating({ onRate }: SatisfactionRatingProps) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');

  const handleRate = (isSatisfied: boolean) => {
    if (!isSatisfied) {
      setShowNote(true);
    } else {
      onRate(true);
    }
  };

  const handleSubmitNote = () => {
    onRate(false, note);
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
    <div className="flex gap-4">
      <button
        onClick={() => handleRate(true)}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        <FaThumbsUp />
        <span>Satisfied</span>
      </button>
      <button
        onClick={() => handleRate(false)}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        <FaThumbsDown />
        <span>Not Satisfied</span>
      </button>
    </div>
  );
}
import React from 'react';

interface LockerSize {
  id: string;
  label: string;
  dimensions: string;
  maxWeight: string;
}

const lockerSizes: LockerSize[] = [
  { id: 'S', label: 'S', dimensions: '60cm x 41cm x 8cm', maxWeight: 'Max 5kg' },
  { id: 'M', label: 'M', dimensions: '60cm x 17cm x 8cm', maxWeight: 'Max 10kg' },
  { id: 'L', label: 'L', dimensions: '60cm x 17cm x 8cm', maxWeight: 'Max 15kg' },
  { id: 'XL', label: 'XL', dimensions: '60cm x 17cm x 8cm', maxWeight: 'Max 20kg' },
];

interface Props {
  selected: string;
  onChange: (size: string) => void;
}

export default function PudoLockerSelector({ selected, onChange }: Props) {
  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-3">Pudo Locker size:</h3>
      <div className="space-y-2">
        {lockerSizes.map((size) => (
          <label
            key={size.id}
            className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <input
              type="radio"
              name="lockerSize"
              value={size.id}
              checked={selected === size.id}
              onChange={() => onChange(size.id)}
              className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3">
              <span className="font-medium">{size.label}</span>
              <span className="text-gray-500 ml-2">| {size.dimensions} ({size.maxWeight})</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
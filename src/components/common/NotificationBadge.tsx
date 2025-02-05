import React from 'react';

interface NotificationBadgeProps {
  count: number;
}

export default function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
      w-4 h-4 flex items-center justify-center rounded-full">
      {count > 9 ? '9+' : count}
    </div>
  );
}
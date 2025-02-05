import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserAvatarProps {
  size?: 'normal' | 'large';
}

export default function UserAvatar({ size = 'normal' }: UserAvatarProps) {
  const { user } = useAuth();
  
  if (!user?.email) return null;
  
  // Get first two letters of email (before @)
  const initials = user.email
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = size === 'large' 
    ? 'w-24 h-24 text-xl'
    : 'w-8 h-8 text-sm';

  return (
    <div className={`${sizeClasses} rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium`}>
      {initials}
    </div>
  );
}
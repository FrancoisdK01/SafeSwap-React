import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
}

export default function Header({ title, showProfile = false }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white z-10 px-4 py-3 shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        {showProfile && (
          <Link 
            to="/profile"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <UserAvatar />
          </Link>
        )}
      </div>
    </header>
  );
}
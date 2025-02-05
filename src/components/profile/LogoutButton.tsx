import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 transition-colors"
      title="Sign out"
    >
      <FaSignOutAlt />
      <span>Sign Out</span>
    </button>
  );
}
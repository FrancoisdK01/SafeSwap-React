import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaExchangeAlt, FaSearch, FaTasks, FaUndoAlt } from 'react-icons/fa';
import { useSearchHistory } from '../contexts/SearchHistoryContext';
import { useTransactions } from '../contexts/TransactionContext';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  active: boolean;
  notificationCount?: number;
  notificationColor?: 'red' | 'default';
  label: string;
}

function NavItem({ to, icon, active, notificationCount = 0, notificationColor = 'default', label }: NavItemProps) {
  return (
    <Link 
      to={to} 
      className="flex flex-col items-center justify-center px-2 py-1 touch-manipulation"
    >
      <div className={`relative ${
        active ? 'text-blue-500' : 'text-gray-400'
      }`}>
        {icon}
        {notificationCount > 0 && (
          <div className={`absolute -top-2 -right-2 ${
            notificationColor === 'red' ? 'bg-red-500' : 'bg-blue-500'
          } text-white text-xs w-4 h-4 flex items-center justify-center rounded-full`}>
            {notificationCount > 9 ? '9+' : notificationCount}
          </div>
        )}
      </div>
      <span className={`text-xs mt-1 ${
        active ? 'text-blue-500' : 'text-gray-400'
      }`}>
        {label}
      </span>
    </Link>
  );
}

export default function Navigation() {
  const location = useLocation();
  const { searchHistory } = useSearchHistory();
  const { transactions } = useTransactions();
  
  const tasksCount = searchHistory.length + 
    transactions.filter(t => t.status === 'paid' && !t.satisfaction_rating).length;

  const returnsCount = transactions.filter(t => t.status === 'returning').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100">
      <div className="max-w-2xl mx-auto px-2 py-2 flex justify-around items-center">
        <NavItem 
          to="/" 
          icon={<FaHome size={20} />} 
          active={location.pathname === '/'} 
          label="Home"
        />
        <NavItem 
          to="/transactions" 
          icon={<FaExchangeAlt size={20} />} 
          active={location.pathname === '/transactions'} 
          label="Transact"
        />
        <NavItem 
          to="/search" 
          icon={<FaSearch size={20} />} 
          active={location.pathname === '/search'} 
          label="Buy"
        />
        <NavItem 
          to="/tasks" 
          icon={<FaTasks size={20} />} 
          active={location.pathname === '/tasks'}
          notificationCount={tasksCount}
          label="Tasks"
        />
        <NavItem 
          to="/returns" 
          icon={<FaUndoAlt size={20} />} 
          active={location.pathname === '/returns'}
          notificationCount={returnsCount}
          notificationColor="red"
          label="Returns"
        />
      </div>
    </nav>
  );
}
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { isAfrikaans, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium hover:bg-blue-200 transition-colors"
    >
      {isAfrikaans ? 'EN' : 'AF'}
    </button>
  );
}
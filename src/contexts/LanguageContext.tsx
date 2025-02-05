import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

interface LanguageContextType {
  isAfrikaans: boolean;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

type TranslationKey = keyof typeof translations.english | keyof typeof translations.afrikaans;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [isAfrikaans, setIsAfrikaans] = useState(false);

  const toggleLanguage = () => setIsAfrikaans(!isAfrikaans);

  const t = (key: string): string => {
    const language = isAfrikaans ? 'afrikaans' : 'english';
    return translations[language][key as TranslationKey] || key;
  };

  return (
    <LanguageContext.Provider value={{ isAfrikaans, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
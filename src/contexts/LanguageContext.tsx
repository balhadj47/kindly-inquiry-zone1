
import React, { createContext, useContext, ReactNode } from 'react';
import { SupportedLanguage, TranslationKeys } from '@/types/language';
import { translations } from '@/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationKeys;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Fixed to French only
  const language: SupportedLanguage = 'fr';
  const setLanguage = () => {}; // No-op since we're French only
  
  const isRTL = false;
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir="ltr">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

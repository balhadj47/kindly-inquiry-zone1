
import React, { createContext, useContext, ReactNode, useState } from 'react';
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
  // Use proper React state management instead of hardcoded value
  const [language, setLanguageState] = useState<SupportedLanguage>('fr');
  
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };
  
  const isRTL = language === 'ar';
  const t = translations[language];

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

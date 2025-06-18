
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
    console.error('useLanguage called outside of LanguageProvider');
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('fr');
  
  console.log('LanguageProvider: Rendering with language:', language);
  
  const setLanguage = (lang: SupportedLanguage) => {
    console.log('LanguageProvider: Setting language to:', lang);
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

  console.log('LanguageProvider: Context value created:', { language, isRTL });

  return (
    <LanguageContext.Provider value={contextValue}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

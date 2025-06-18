
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
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
  // Use React.useState explicitly to ensure React is available
  const [language, setLanguageState] = React.useState<SupportedLanguage>('fr');
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  console.log('LanguageProvider: Rendering with language:', language);
  
  React.useEffect(() => {
    // Ensure context is properly initialized
    setIsInitialized(true);
    console.log('LanguageProvider: Context initialized');
  }, []);
  
  const setLanguage = React.useCallback((lang: SupportedLanguage) => {
    console.log('LanguageProvider: Setting language to:', lang);
    setLanguageState(lang);
  }, []);
  
  const isRTL = language === 'ar';
  const t = translations[language];

  const contextValue: LanguageContextType = React.useMemo(() => ({
    language,
    setLanguage,
    t,
    isRTL
  }), [language, setLanguage, t, isRTL]);

  console.log('LanguageProvider: Context value created:', { language, isRTL, isInitialized });

  // Don't render children until context is properly initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

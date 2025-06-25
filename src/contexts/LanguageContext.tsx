
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/translations';
import type { Language, TranslationKeys } from '@/types/language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    const validLanguage = saved === 'en' || saved === 'fr' || saved === 'ar' ? saved : 'fr';
    console.log('🌐 LanguageContext: Initial language loaded:', validLanguage);
    return validLanguage;
  });

  useEffect(() => {
    console.log('🌐 LanguageContext: Language changed to:', language);
    console.log('🌐 LanguageContext: Available translations:', Object.keys(translations[language]));
    localStorage.setItem('language', language);
  }, [language]);

  const t = translations[language];
  
  // Validate translations are loaded properly
  useEffect(() => {
    if (!t) {
      console.error('❌ LanguageContext: Translations not found for language:', language);
    } else {
      console.log('✅ LanguageContext: Translations loaded successfully for:', language);
      console.log('🔧 LanguageContext: Translation keys:', Object.keys(t));
    }
  }, [t, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error('❌ useLanguage must be used within a LanguageProvider');
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

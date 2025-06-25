
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
    try {
      const saved = localStorage.getItem('language');
      const validLanguage = saved === 'en' || saved === 'fr' || saved === 'ar' ? saved : 'fr';
      console.log('🌐 LanguageContext: Initial language loaded:', validLanguage);
      return validLanguage;
    } catch (error) {
      console.warn('🌐 LanguageContext: Error loading language from localStorage:', error);
      return 'fr';
    }
  });

  useEffect(() => {
    try {
      console.log('🌐 LanguageContext: Language changed to:', language);
      
      if (translations && translations[language]) {
        console.log('🌐 LanguageContext: Available translations:', Object.keys(translations[language] || {}));
        localStorage.setItem('language', language);
      } else {
        console.warn('🌐 LanguageContext: Translations not available for language:', language);
      }
    } catch (error) {
      console.warn('🌐 LanguageContext: Error saving language to localStorage:', error);
    }
  }, [language]);

  // Safe translation retrieval with fallbacks
  const getTranslations = (): TranslationKeys => {
    try {
      if (!translations) {
        console.error('❌ LanguageContext: Translations object not available');
        return {} as TranslationKeys;
      }
      
      const currentTranslations = translations[language];
      if (!currentTranslations) {
        console.warn('⚠️ LanguageContext: No translations for language:', language, 'falling back to French');
        return translations.fr || {} as TranslationKeys;
      }
      
      return currentTranslations;
    } catch (error) {
      console.error('❌ LanguageContext: Error getting translations:', error);
      return {} as TranslationKeys;
    }
  };

  const t = getTranslations();
  
  // Validate translations are loaded properly
  useEffect(() => {
    try {
      if (!t || Object.keys(t).length === 0) {
        console.error('❌ LanguageContext: Translations not found for language:', language);
      } else {
        console.log('✅ LanguageContext: Translations loaded successfully for:', language);
      }
    } catch (error) {
      console.error('❌ LanguageContext: Error validating translations:', error);
    }
  }, [t, language]);

  const contextValue = {
    language,
    setLanguage,
    t: t || {} as TranslationKeys
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error('❌ useLanguage must be used within a LanguageProvider');
    // Instead of throwing, return a safe fallback
    return {
      language: 'fr' as Language,
      setLanguage: () => {},
      t: {
        dashboard: 'Dashboard',
        companies: 'Companies',
        vansDrivers: 'Vans & Drivers',
        employees: 'Employees',
        comptes: 'Accounts',
        logTrip: 'Log Trip',
        tripHistory: 'Trip History'
      } as TranslationKeys
    };
  }
  return context;
};

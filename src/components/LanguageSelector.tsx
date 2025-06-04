
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { SupportedLanguage } from '@/types/language';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as SupportedLanguage, name: 'English', flag: '🇺🇸' },
    { code: 'fr' as SupportedLanguage, name: 'Français', flag: '🇫🇷' },
    { code: 'ar' as SupportedLanguage, name: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <Select value={language} onValueChange={(value: SupportedLanguage) => setLanguage(value)}>
      <SelectTrigger className="w-40">
        <SelectValue>
          {languages.find(lang => lang.code === language)?.flag} {languages.find(lang => lang.code === language)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center space-x-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;

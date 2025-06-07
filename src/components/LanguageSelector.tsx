
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Earth } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SupportedLanguage } from '@/types/language';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as SupportedLanguage, name: 'English' },
    { code: 'fr' as SupportedLanguage, name: 'Français' },
    { code: 'ar' as SupportedLanguage, name: 'العربية' },
  ];

  return (
    <Select value={language} onValueChange={(value: SupportedLanguage) => setLanguage(value)}>
      <SelectTrigger className="w-40">
        <SelectValue>
          <div className="flex items-center space-x-2">
            <Earth className="h-4 w-4" />
            <span>{languages.find(lang => lang.code === language)?.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center space-x-2">
              <Earth className="h-4 w-4" />
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;

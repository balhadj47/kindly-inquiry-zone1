
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
      <SelectTrigger className="w-10 h-10 p-0 border-0 bg-transparent hover:bg-accent rounded-full transition-colors">
        <SelectValue>
          <Earth className="h-4 w-4 mx-auto text-muted-foreground" />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[140px]">
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


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
      <SelectTrigger className="w-12 h-10 p-0 border border-border bg-background hover:bg-accent rounded-lg transition-colors">
        <SelectValue>
          <Earth className="h-4 w-4 mx-auto text-muted-foreground" />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[160px]">
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
            <span className="flex items-center space-x-3">
              <Earth className="h-4 w-4 text-muted-foreground" />
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompaniesHeaderProps {
  onAddCompany: () => void;
}

const CompaniesHeader = ({ onAddCompany }: CompaniesHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.companies}</h1>
      <Button 
        onClick={onAddCompany} 
        className="w-full sm:w-auto flex items-center justify-center gap-2 touch-manipulation"
        size="lg"
      >
        <Plus className="h-4 w-4" />
        <span className="sm:inline">{t.addNewCompany}</span>
      </Button>
    </div>
  );
};

export default CompaniesHeader;


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
        size="icon"
        className="w-10 h-10 rounded-full"
        title={t.addNewCompany}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CompaniesHeader;

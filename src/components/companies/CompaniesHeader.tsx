
import React from 'react';
import { PlusButton } from '@/components/ui/plus-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompaniesHeaderProps {
  onAddCompany: () => void;
}

const CompaniesHeader = ({ onAddCompany }: CompaniesHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.companies}</h1>
        <p className="text-gray-600 mt-1">
          {t.manageCompaniesAndBranches}
        </p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PlusButton onClick={onAddCompany} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{t.addNewCompany}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CompaniesHeader;

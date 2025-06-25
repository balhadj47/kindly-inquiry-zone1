
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
            <Button onClick={onAddCompany} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
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

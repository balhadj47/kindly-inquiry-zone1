
import React from 'react';
import { Building2, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompaniesHeaderProps {
  onAddCompany: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const CompaniesHeader = ({ onAddCompany, onRefresh, isRefreshing = false }: CompaniesHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Building2 className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.companies}</h1>
          <p className="text-gray-600 mt-1">
            {t.manageCompaniesAndBranches}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onAddCompany}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          ajouter
        </Button>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompaniesHeader;

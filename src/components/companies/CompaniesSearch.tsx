
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompaniesSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  companiesCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const CompaniesSearch = ({ 
  searchTerm, 
  setSearchTerm,
  companiesCount,
  totalCount,
  hasActiveFilters,
  onClearFilters
}: CompaniesSearchProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="p-4 sm:pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t.searchCompanies}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-base touch-manipulation"
          />
        </div>
        
        {hasActiveFilters && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>{companiesCount} sur {totalCount} entreprises</span>
            <button
              onClick={onClearFilters}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompaniesSearch;

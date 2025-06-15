
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompaniesEmptyStateProps {
  searchTerm: string;
  onAddCompany: () => void;
}

const CompaniesEmptyState = ({ searchTerm, onAddCompany }: CompaniesEmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noCompanyFoundMessage}</h3>
        <p className="text-gray-600 mb-4">
          {searchTerm 
            ? t.tryAdjustingSearch 
            : t.addFirstCompany
          }
        </p>
        {!searchTerm && (
          <Button onClick={onAddCompany}>
            <Plus className="h-4 w-4 mr-2" />
            {t.addYourFirstCompany}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CompaniesEmptyState;

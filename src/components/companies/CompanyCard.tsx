
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Company } from '@/hooks/useCompanies';

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

const CompanyCard = ({ company, onEdit, onDelete }: CompanyCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="hover:shadow-lg transition-shadow touch-manipulation">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-2 min-w-0 flex-1">
            <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <CardTitle className="text-base sm:text-lg leading-tight break-words">{company.name}</CardTitle>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(company);
              }}
              className="touch-manipulation"
            >
              {t.edit}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(company);
              }}
              className="touch-manipulation text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {t.branches} ({company.branches.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {company.branches.slice(0, 2).map((branch, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {branch.name}
              </Badge>
            ))}
            {company.branches.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{company.branches.length - 2} {t.more}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 border-t border-gray-100 gap-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{company.branches.length}</span> succursales
          </div>
          <div className="text-xs text-gray-500">
            Créée le {new Date(company.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;

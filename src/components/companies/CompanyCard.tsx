
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
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
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 break-words mb-1">
                {company.name}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                Créée le {new Date(company.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(company);
              }}
              className="touch-manipulation hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Edit className="h-3 w-3 mr-1" />
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(company);
              }}
              className="touch-manipulation text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-white/80 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-600" />
              Succursales ({company.branches.length})
            </h4>
            <Badge 
              variant={company.branches.length > 0 ? "default" : "secondary"} 
              className="text-xs font-medium"
            >
              {company.branches.length} {company.branches.length === 1 ? 'succursale' : 'succursales'}
            </Badge>
          </div>
          
          {company.branches.length > 0 ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {company.branches.slice(0, 3).map((branch, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  >
                    {branch.name}
                  </Badge>
                ))}
                {company.branches.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs text-blue-600 border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    +{company.branches.length - 3} autres
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Aucune succursale configurée</p>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-200/60">
          <div className="text-sm">
            <span className="font-semibold text-blue-600">{company.branches.length}</span>
            <span className="text-gray-600 ml-1">
              {company.branches.length === 1 ? 'succursale' : 'succursales'}
            </span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            ID: {company.id.slice(0, 8)}...
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;

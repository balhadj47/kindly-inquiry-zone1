
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { useRBAC } from '@/contexts/RBACContext';

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  onAddBranch: (company: Company) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onEdit,
  onDelete,
  onAddBranch,
}) => {
  const { hasPermission } = useRBAC();
  
  // Check permissions for each action
  const canEditCompanies = hasPermission('companies:update');
  const canDeleteCompanies = hasPermission('companies:delete');
  const canCreateBranches = hasPermission('companies:create'); // Assuming branch creation uses companies:create

  const showActions = canEditCompanies || canDeleteCompanies || canCreateBranches;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{company.name}</h3>
              <Badge variant="secondary" className="mt-1">
                {company.branches?.length || 0} succursale{(company.branches?.length || 0) !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
          
          {showActions && (
            <div className="flex space-x-1">
              {canEditCompanies && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(company)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {canDeleteCompanies && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(company)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
          {company.address && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{company.address}</span>
            </div>
          )}
          
          {company.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{company.phone}</span>
            </div>
          )}
          
          {company.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{company.email}</span>
            </div>
          )}
        </div>

        {company.branches && company.branches.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-900 mb-2">Succursales récentes:</h4>
            <div className="space-y-1">
              {company.branches.slice(0, 2).map((branch) => (
                <div key={branch.id} className="text-xs text-gray-500 flex items-center space-x-1">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate">{branch.name}</span>
                </div>
              ))}
              {company.branches.length > 2 && (
                <div className="text-xs text-gray-400">
                  +{company.branches.length - 2} autre{company.branches.length - 2 !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}

        {canCreateBranches && (
          <div className="pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddBranch(company)}
              className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Ajouter une succursale
            </Button>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
          Créé le: {new Date(company.createdAt).toLocaleDateString('fr-FR')}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;

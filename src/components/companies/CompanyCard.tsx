
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone, Mail, Edit, Trash2, Plus } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  branches?: Branch[];
}

interface Branch {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

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
  
  const canUpdateCompanies = hasPermission('companies:update');
  const canDeleteCompanies = hasPermission('companies:delete');
  const canCreateBranches = hasPermission('companies:create');

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{company.name}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {company.branches?.length || 0} succursale(s)
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {canUpdateCompanies && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(company)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            {canDeleteCompanies && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(company)}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {company.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{company.email}</span>
          </div>
        )}
        
        {company.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{company.phone}</span>
          </div>
        )}
        
        {company.address && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{company.address}</span>
          </div>
        )}

        {company.branches && company.branches.length > 0 && (
          <div className="pt-3 border-t">
            <h4 className="font-medium text-sm text-gray-900 mb-2">Succursales</h4>
            <div className="space-y-2">
              {company.branches.slice(0, 3).map((branch) => (
                <div key={branch.id} className="text-sm text-gray-600">
                  • {branch.name}
                </div>
              ))}
              {company.branches.length > 3 && (
                <div className="text-sm text-gray-500">
                  +{company.branches.length - 3} autres
                </div>
              )}
            </div>
          </div>
        )}

        {canCreateBranches && (
          <div className="pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddBranch(company)}
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une succursale
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyCard;

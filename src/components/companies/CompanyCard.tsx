import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Building, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { EntityCard } from '@/components/ui/entity-card';
import { Button } from '@/components/ui/button';

interface Branch {
  id: string;
  name: string;
  company_id: string;
  created_at: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
  branches: Branch[];
}

interface CompanyCardProps {
  company: Company;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
  onClick?: (company: Company) => void;
  onAddBranch?: (company: Company) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onEdit,
  onDelete,
  onClick,
  onAddBranch,
  canEdit = false,
  canDelete = false
}) => {
  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusConfig = (branchCount: number) => {
    if (branchCount > 0) {
      return { variant: 'default' as const, color: 'green' };
    }
    return { variant: 'secondary' as const, color: 'gray' };
  };

  const statusConfig = getStatusConfig(company.branches?.length || 0);

  const metadata = [
    company.address && {
      label: 'Adresse',
      value: company.address,
      icon: <MapPin className="h-4 w-4" />
    },
    company.phone && {
      label: 'Téléphone',
      value: company.phone,
      icon: <Phone className="h-4 w-4" />
    },
    company.email && {
      label: 'Email',
      value: company.email,
      icon: <Mail className="h-4 w-4" />
    },
    {
      label: 'Succursales',
      value: `${company.branches?.length || 0} succursale${(company.branches?.length || 0) !== 1 ? 's' : ''}`,
      icon: <Building className="h-4 w-4" />
    },
    {
      label: 'Créé le',
      value: new Date(company.created_at).toLocaleDateString('fr-FR'),
      icon: <Calendar className="h-4 w-4" />
    }
  ].filter(Boolean);

  const actions = (
    <div className="flex items-center gap-2">
      {canEdit && onEdit && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(company);
          }}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-blue-500 text-white hover:bg-blue-600"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {canDelete && onDelete && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(company);
          }}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <EntityCard
      title={company.name}
      status={{
        label: company.branches?.length ? `${company.branches.length} succursale${company.branches.length !== 1 ? 's' : ''}` : 'Aucune succursale',
        variant: statusConfig.variant,
        color: statusConfig.color
      }}
      metadata={metadata}
      actions={actions}
      onClick={onClick ? () => onClick(company) : undefined}
      className="group hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-12 w-12 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200">
          <AvatarImage 
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${company.name}`}
            alt={company.name}
          />
          <AvatarFallback className="bg-gray-600 text-white font-medium">
            {getCompanyInitials(company.name)}
          </AvatarFallback>
        </Avatar>
        <div className="text-xs text-gray-500">
          Entreprise: {company.branches?.length || 0} succursale{(company.branches?.length || 0) !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="mb-4">
        <Badge 
          variant="outline" 
          className="text-xs font-medium text-blue-600 border-blue-200"
        >
          {company.branches?.length ? `${company.branches.length} succursale${company.branches.length !== 1 ? 's' : ''}` : 'Aucune succursale'}
        </Badge>
      </div>

      {company.branches && company.branches.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Building className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-600 font-medium mb-1">Succursales</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {company.branches.slice(0, 3).map(branch => branch.name).join(', ')}
                {company.branches.length > 3 && ` et ${company.branches.length - 3} autre${company.branches.length - 3 !== 1 ? 's' : ''}...`}
              </p>
            </div>
          </div>
        </div>
      )}
    </EntityCard>
  );
};

export default CompanyCard;

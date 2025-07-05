
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Building, MapPin, Phone, Mail, Plus } from 'lucide-react';
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
  canEdit = true,
  canDelete = true
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
  const branchCount = company.branches?.length || 0;

  // Compact metadata - only show most important info
  const metadata = [
    company.address && {
      label: 'Adresse',
      value: company.address.length > 30 ? `${company.address.substring(0, 30)}...` : company.address,
      icon: <MapPin className="h-4 w-4" />
    },
    company.phone && {
      label: 'Téléphone',
      value: company.phone,
      icon: <Phone className="h-4 w-4" />
    },
    company.email && {
      label: 'Email',
      value: company.email.length > 25 ? `${company.email.substring(0, 25)}...` : company.email,
      icon: <Mail className="h-4 w-4" />
    }
  ].filter(Boolean);

  const actions = (
    <div className="flex items-center gap-1">
      {onAddBranch && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddBranch(company);
          }}
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 bg-green-500 text-white hover:bg-green-600 transition-all duration-200"
          title="Ajouter une succursale"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
      {canEdit && onEdit && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(company);
          }}
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
          title="Modifier l'entreprise"
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
          className="h-9 w-9 p-0 bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
          title="Supprimer l'entreprise"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <EntityCard
      title={company.name}
      subtitle={`Créé le ${new Date(company.created_at).toLocaleDateString('fr-FR')}`}
      status={{
        label: branchCount > 0 ? `${branchCount} succursale${branchCount !== 1 ? 's' : ''}` : 'Aucune succursale',
        variant: statusConfig.variant,
        color: statusConfig.color
      }}
      metadata={metadata}
      actions={actions}
      onClick={onClick ? () => onClick(company) : undefined}
      className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-blue-300 min-h-[200px]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${company.name}`}
              alt={company.name}
            />
            <AvatarFallback className="bg-blue-600 text-white font-medium text-sm">
              {getCompanyInitials(company.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">
              {branchCount} succursale{branchCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Compact branch preview - only show if there are branches */}
      {company.branches && company.branches.length > 0 && (
        <div className="mt-3 p-2 bg-blue-50/70 border border-blue-200/50 rounded-md">
          <div className="text-xs text-blue-600 font-medium mb-1">
            Succursales principales
          </div>
          <div className="text-sm text-gray-700">
            {company.branches.slice(0, 2).map(branch => branch.name).join(', ')}
            {company.branches.length > 2 && ` +${company.branches.length - 2} autres`}
          </div>
        </div>
      )}
    </EntityCard>
  );
};

export default CompanyCard;

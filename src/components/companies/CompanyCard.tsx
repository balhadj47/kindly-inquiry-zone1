
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

  // Improved metadata with better formatting
  const metadata = [
    company.address && {
      label: 'Adresse',
      value: company.address.length > 35 ? `${company.address.substring(0, 35)}...` : company.address,
      icon: <MapPin className="h-4 w-4 text-blue-600" />
    },
    company.phone && {
      label: 'Téléphone',
      value: company.phone,
      icon: <Phone className="h-4 w-4 text-green-600" />
    },
    company.email && {
      label: 'Email',
      value: company.email.length > 30 ? `${company.email.substring(0, 30)}...` : company.email,
      icon: <Mail className="h-4 w-4 text-purple-600" />
    }
  ].filter(Boolean);

  const actions = (
    <div className="flex items-center gap-2">
      {onAddBranch && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddBranch(company);
          }}
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 bg-green-500 text-white hover:bg-green-600 transition-all duration-200 rounded-full"
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
          className="h-9 w-9 p-0 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 rounded-full"
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
          className="h-9 w-9 p-0 bg-red-500 text-white hover:bg-red-600 transition-all duration-200 rounded-full"
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
      className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-blue-400 min-h-[240px] bg-white"
    >
      {/* Enhanced header section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all duration-200 shadow-sm">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${company.name}`}
              alt={company.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm">
              {getCompanyInitials(company.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-3">
            <Building className="h-5 w-5 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {branchCount} succursale{branchCount !== 1 ? 's' : ''}
              </span>
              <span className="text-xs text-gray-500">
                {branchCount > 0 ? 'Active' : 'En attente'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced branch preview */}
      {company.branches && company.branches.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
          <div className="flex items-center mb-2">
            <Building className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-semibold text-blue-800">
              Succursales principales
            </span>
          </div>
          <div className="space-y-1">
            {company.branches.slice(0, 2).map((branch, index) => (
              <div key={branch.id} className="text-sm text-gray-700 font-medium">
                • {branch.name}
              </div>
            ))}
            {company.branches.length > 2 && (
              <div className="text-xs text-blue-600 font-medium mt-2">
                +{company.branches.length - 2} autre{company.branches.length - 2 > 1 ? 's' : ''} succursale{company.branches.length - 2 > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}

      {/* No branches state */}
      {(!company.branches || company.branches.length === 0) && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center text-gray-500">
            <Building className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Aucune succursale configurée</span>
          </div>
        </div>
      )}
    </EntityCard>
  );
};

export default CompanyCard;

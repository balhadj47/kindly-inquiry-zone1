
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Building, MapPin, Phone, Mail, Plus, Users } from 'lucide-react';
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

  const branchCount = company.branches?.length || 0;

  return (
    <div 
      className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onClick ? () => onClick(company) : undefined}
    >
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Avatar className="h-14 w-14 ring-2 ring-blue-100 shadow-sm">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${company.name}`}
                alt={company.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                {getCompanyInitials(company.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 truncate mb-1">
                {company.name}
              </h3>
              <p className="text-sm text-gray-500">
                Créé le {new Date(company.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onAddBranch && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddBranch(company);
                }}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 bg-green-50 text-green-600 hover:bg-green-100"
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
                className="h-9 w-9 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100"
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
                className="h-9 w-9 p-0 bg-red-50 text-red-600 hover:bg-red-100"
                title="Supprimer l'entreprise"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-1 gap-3">
          {company.address && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-blue-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700 truncate" title={company.address}>
                {company.address.length > 40 ? `${company.address.substring(0, 40)}...` : company.address}
              </span>
            </div>
          )}
          
          {company.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">
                {company.phone}
              </span>
            </div>
          )}
          
          {company.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 text-purple-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700 truncate" title={company.email}>
                {company.email.length > 30 ? `${company.email.substring(0, 30)}...` : company.email}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Branches Section */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Building className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-semibold text-gray-900">
              Succursales
            </span>
          </div>
          <Badge 
            variant={branchCount > 0 ? 'default' : 'secondary'}
            className={`text-xs font-medium ${
              branchCount > 0 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {branchCount} {branchCount !== 1 ? 'succursales' : 'succursale'}
          </Badge>
        </div>

        {branchCount > 0 ? (
          <div className="space-y-2">
            {company.branches.slice(0, 3).map((branch) => (
              <div key={branch.id} className="flex items-center text-sm bg-blue-50 rounded-lg p-2">
                <Users className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-blue-800 font-medium truncate">
                  {branch.name}
                </span>
              </div>
            ))}
            {branchCount > 3 && (
              <div className="text-xs text-center text-blue-600 font-medium mt-2 py-1">
                +{branchCount - 3} autre{branchCount - 3 > 1 ? 's' : ''} succursale{branchCount - 3 > 1 ? 's' : ''}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-4 text-gray-500 bg-gray-50 rounded-lg">
            <Building className="h-4 w-4 mr-2" />
            <span className="text-sm">Aucune succursale</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;

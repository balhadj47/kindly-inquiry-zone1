
import React from 'react';
import { Plus, RefreshCw, Building } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { ActionButton } from '@/components/ui/action-button';
import { Button } from '@/components/ui/button';

interface CompaniesHeaderProps {
  onAdd: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const CompaniesHeader: React.FC<CompaniesHeaderProps> = ({ 
  onAdd, 
  onRefresh, 
  isRefreshing = false 
}) => {
  const { hasPermission } = useRBAC();
  
  const canCreateCompanies = hasPermission('companies:create');

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Building className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Entreprises</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos entreprises et leurs succursales
          </p>
        </div>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {canCreateCompanies && (
          <ActionButton
            onClick={onAdd}
            icon={Plus}
            variant="primary"
            size="default"
          >
            Nouvelle Entreprise
          </ActionButton>
        )}
      </div>
    </div>
  );
};

export default CompaniesHeader;

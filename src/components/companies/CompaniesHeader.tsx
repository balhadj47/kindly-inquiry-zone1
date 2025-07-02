
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { ActionButton } from '@/components/ui/action-button';

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Entreprises</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos entreprises et leurs succursales
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {onRefresh && (
          <ActionButton
            onClick={onRefresh}
            icon={RefreshCw}
            variant="outline"
            size="default"
            disabled={isRefreshing}
            loading={isRefreshing}
          >
            Actualiser
          </ActionButton>
        )}
        
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


import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

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
      
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        )}
        
        {canCreateCompanies && (
          <Button 
            onClick={onAdd}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une Entreprise
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompaniesHeader;

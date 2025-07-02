
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
        {canCreateCompanies && (
          <Button 
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une Entreprise
          </Button>
        )}
        
        {onRefresh && (
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompaniesHeader;

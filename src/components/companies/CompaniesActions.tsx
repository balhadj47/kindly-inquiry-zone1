
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

interface CompaniesActionsProps {
  onCreateCompany: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const CompaniesActions: React.FC<CompaniesActionsProps> = ({
  onCreateCompany,
  onRefresh,
  isRefreshing = false
}) => {
  const { canCreateCompanies } = usePermissionCheck();

  return (
    <div className="flex items-center gap-2">
      {canCreateCompanies && (
        <Button
          onClick={onCreateCompany}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Entreprise
        </Button>
      )}
      
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        Actualiser
      </Button>
    </div>
  );
};

export default CompaniesActions;

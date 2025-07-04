
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { Button } from '@/components/ui/button';

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
    <div className="flex items-center gap-3">
      {canCreateCompanies && (
        <Button
          onClick={onCreateCompany}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Entreprise
        </Button>
      )}
      
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="bg-blue-600 hover:bg-blue-700 text-white"
        variant="default"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        Actualiser
      </Button>
    </div>
  );
};

export default CompaniesActions;

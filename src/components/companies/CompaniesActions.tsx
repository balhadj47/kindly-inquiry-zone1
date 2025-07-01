
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
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="h-9"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
      
      {canCreateCompanies && (
        <Button
          onClick={onCreateCompany}
          size="sm"
          className="h-9"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle Entreprise
        </Button>
      )}
    </div>
  );
};

export default CompaniesActions;

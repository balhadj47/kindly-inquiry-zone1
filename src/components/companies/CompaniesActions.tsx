
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { ActionButton } from '@/components/ui/action-button';

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
      
      {canCreateCompanies && (
        <ActionButton
          onClick={onCreateCompany}
          icon={Plus}
          variant="primary"
          size="default"
        >
          Nouvelle Entreprise
        </ActionButton>
      )}
    </div>
  );
};

export default CompaniesActions;

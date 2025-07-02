
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { ActionButton } from '@/components/ui/action-button';

interface EmployeesActionsProps {
  onCreateEmployee: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  canCreateEmployees: boolean;
}

const EmployeesActions: React.FC<EmployeesActionsProps> = ({
  onCreateEmployee,
  onRefresh,
  isRefreshing = false,
  canCreateEmployees
}) => {
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
      
      {canCreateEmployees && (
        <ActionButton
          onClick={onCreateEmployee}
          icon={Plus}
          variant="primary"
          size="default"
        >
          Nouvel Employé
        </ActionButton>
      )}
    </div>
  );
};

export default EmployeesActions;

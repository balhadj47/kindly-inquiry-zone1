
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

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
      
      {canCreateEmployees && (
        <Button
          onClick={onCreateEmployee}
          size="sm"
          className="h-9"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nouvel Employé
        </Button>
      )}
    </div>
  );
};

export default EmployeesActions;

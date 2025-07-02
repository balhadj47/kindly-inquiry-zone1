
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      {canCreateEmployees && (
        <Button
          onClick={onCreateEmployee}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Employé
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

export default EmployeesActions;

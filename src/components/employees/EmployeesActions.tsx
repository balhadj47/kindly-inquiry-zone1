
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
        onClick={onRefresh}
        disabled={isRefreshing}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        Actualiser
      </Button>
      
      {canCreateEmployees && (
        <Button
          onClick={onCreateEmployee}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Employé
        </Button>
      )}
    </div>
  );
};

export default EmployeesActions;

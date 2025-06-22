
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

interface EmployeesHeaderProps {
  onAddEmployee: () => void;
  canCreate: boolean;
  employeesCount: number;
}

const EmployeesHeader: React.FC<EmployeesHeaderProps> = ({ 
  onAddEmployee, 
  canCreate, 
  employeesCount 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Users className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Employés</h1>
          <p className="text-gray-600 mt-1">
            {employeesCount} employé{employeesCount !== 1 ? 's' : ''} sur le terrain
          </p>
        </div>
      </div>
      
      {canCreate && (
        <Button onClick={onAddEmployee} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouvel Employé</span>
        </Button>
      )}
    </div>
  );
};

export default EmployeesHeader;

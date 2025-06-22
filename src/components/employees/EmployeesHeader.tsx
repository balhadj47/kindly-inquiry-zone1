
import React from 'react';
import { Users } from 'lucide-react';

interface EmployeesHeaderProps {
  employeesCount: number;
}

const EmployeesHeader: React.FC<EmployeesHeaderProps> = ({ 
  employeesCount 
}) => {
  return (
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
  );
};

export default EmployeesHeader;

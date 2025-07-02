
import React, { memo } from 'react';
import { Users } from 'lucide-react';
import { User } from '@/types/rbac';
import EmployeeCard from './EmployeeCard';

interface EmployeesListProps {
  employees: User[];
  searchTerm: string;
  statusFilter: string;
  onEditEmployee: (employee: User) => void;
  onDeleteEmployee: (employee: User) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const EmployeesList: React.FC<EmployeesListProps> = memo(({
  employees,
  onEditEmployee,
  onDeleteEmployee,
  canEdit,
  canDelete,
}) => {
  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Users className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun employé trouvé
        </h3>
        <p className="text-gray-500">
          Aucun employé ne correspond aux filtres actuels.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map(employee => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onEdit={onEditEmployee}
          onDelete={onDeleteEmployee}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
});

EmployeesList.displayName = 'EmployeesList';

export default EmployeesList;

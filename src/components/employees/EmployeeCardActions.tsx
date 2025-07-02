
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Key } from 'lucide-react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

interface Employee {
  id: string;
  name: string;
  email?: string;
  phone: string;
  status: string;
}

interface EmployeeCardActionsProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onView: (employee: Employee) => void;
  onChangePassword: (employee: Employee) => void;
}

const EmployeeCardActions: React.FC<EmployeeCardActionsProps> = ({
  employee,
  onEdit,
  onDelete,
  onView,
  onChangePassword
}) => {
  const { canUpdateUsers, canDeleteUsers } = usePermissionCheck();

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onView(employee)}
        className="h-8 px-3 bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <Eye className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Voir</span>
      </Button>
      
      {canUpdateUsers && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(employee)}
            className="h-8 px-3 bg-white hover:bg-green-50 border-green-200 text-green-600 hover:text-green-700 hover:border-green-300 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Modifier</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangePassword(employee)}
            className="h-8 px-3 bg-white hover:bg-orange-50 border-orange-200 text-orange-600 hover:text-orange-700 hover:border-orange-300 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Key className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Mot de passe</span>
          </Button>
        </>
      )}
      
      {canDeleteUsers && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(employee)}
          className="h-8 px-3 bg-white hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700 hover:border-red-300 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Supprimer</span>
        </Button>
      )}
    </div>
  );
};

export default EmployeeCardActions;

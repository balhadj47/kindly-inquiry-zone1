
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
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onView(employee)}
        style={{
          backgroundColor: 'white',
          borderColor: '#d1d5db',
          color: '#4b5563'
        }}
        className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {canUpdateUsers && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(employee)}
            style={{
              backgroundColor: 'white',
              borderColor: '#93c5fd',
              color: '#2563eb'
            }}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-400"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangePassword(employee)}
            style={{
              backgroundColor: 'white',
              borderColor: '#86efac',
              color: '#16a34a'
            }}
            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-800 hover:border-green-400"
          >
            <Key className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {canDeleteUsers && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(employee)}
          style={{
            backgroundColor: 'white',
            borderColor: '#fca5a5',
            color: '#dc2626'
          }}
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EmployeeCardActions;

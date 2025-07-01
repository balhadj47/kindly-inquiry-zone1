
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
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(employee)}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {canUpdateUsers && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(employee)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChangePassword(employee)}
            className="h-8 w-8 p-0"
          >
            <Key className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {canDeleteUsers && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(employee)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EmployeeCardActions;

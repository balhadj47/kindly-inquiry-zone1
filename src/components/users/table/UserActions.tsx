
import React from 'react';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Key, Trash } from 'lucide-react';
import { User } from '@/types/rbac';

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onChangePassword: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserActions: React.FC<UserActionsProps> = ({
  user,
  onEdit,
  onChangePassword,
  onDelete,
}) => {
  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onEdit(user)}
      >
        <UserIcon className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onChangePassword(user)}
      >
        <Key className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        onClick={() => onDelete(user)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserActions;

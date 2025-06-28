
import React from 'react';
import { Button } from '@/components/ui/button';
import { Key, User as UserIcon, Trash } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { User } from '@/types/rbac';

interface UserCardActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UserCardActions: React.FC<UserCardActionsProps> = ({
  user,
  onEdit,
  onDelete,
  onChangePassword,
}) => {
  const { hasPermission } = useRBAC();
  
  const canUpdateUsers = hasPermission('users:update');
  const canDeleteUsers = hasPermission('users:delete');

  return (
    <div className="flex items-center space-x-1">
      {canUpdateUsers && (
        <>
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
        </>
      )}
      
      {canDeleteUsers && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer l'utilisateur "{user.name}" ? 
                Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(user)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default UserCardActions;

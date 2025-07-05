
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { User } from '@/types/rbac';

interface EmployeeDeleteDialogProps {
  isOpen: boolean;
  employee: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const EmployeeDeleteDialog: React.FC<EmployeeDeleteDialogProps> = ({
  isOpen,
  employee,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={() => onCancel()}>
      <AlertDialogContent className="sm:max-w-[425px] top-8 translate-y-0">
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l'employé</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l'employé "{employee?.name}" ? 
            Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmployeeDeleteDialog;

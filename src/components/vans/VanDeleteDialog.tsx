
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

interface VanDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  van: any;
  onConfirm: () => void;
  isLoading: boolean;
}

const VanDeleteDialog = ({ isOpen, onClose, van, onConfirm, isLoading }: VanDeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="fixed top-[20vh] left-1/2 transform -translate-x-1/2 z-50">
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la camionnette</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer la camionnette {van?.license_plate || van?.model} ?
            Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VanDeleteDialog;

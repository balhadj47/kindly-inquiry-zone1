
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
import { Trip } from '@/contexts/TripContext';

interface MissionActionDialogProps {
  mission: Trip | null;
  action: 'delete' | 'terminate' | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const MissionActionDialog: React.FC<MissionActionDialogProps> = ({
  mission,
  action,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  if (!mission || !action) return null;

  const isDelete = action === 'delete';
  const isTerminate = action === 'terminate';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDelete ? 'Supprimer la Mission' : 'Terminer la Mission'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDelete ? (
              <>
                Êtes-vous sûr de vouloir supprimer cette mission pour{' '}
                <strong>{mission.company} - {mission.branch}</strong>?
                <br />
                Cette action est irréversible.
              </>
            ) : (
              <>
                Êtes-vous sûr de vouloir terminer cette mission pour{' '}
                <strong>{mission.company} - {mission.branch}</strong>?
                <br />
                Le statut de la mission passera à "Terminé".
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={isDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}
          >
            {isLoading ? 'En cours...' : (isDelete ? 'Supprimer' : 'Terminer')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MissionActionDialog;

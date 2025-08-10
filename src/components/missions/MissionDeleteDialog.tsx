
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
import { useIsMobile } from '@/hooks/use-mobile';
import { useVans } from '@/hooks/useVansOptimized';
import { useUsers } from '@/hooks/users';
import { getDriverName, getChefDeGroupeName } from './utils/missionCardUtils';

interface MissionDeleteDialogProps {
  mission: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const MissionDeleteDialog: React.FC<MissionDeleteDialogProps> = ({
  mission,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  const isMobile = useIsMobile();
  const { data: vans = [] } = useVans();
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];

  if (!mission) return null;

  const getVanDisplayName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId || v.reference_code === vanId);
    return van?.reference_code || vanId || 'Van inconnu';
  };

  const driverName = getDriverName(mission, users);
  const chefDeGroupeName = getChefDeGroupeName(mission, users);
  const vanDisplayName = getVanDisplayName(mission.van);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={isMobile ? 'w-[95vw] max-w-md' : ''}>
        <AlertDialogHeader>
          <AlertDialogTitle className={isMobile ? 'text-base' : ''}>
            Supprimer la mission
          </AlertDialogTitle>
          <AlertDialogDescription className={isMobile ? 'text-sm' : ''}>
            <div className="space-y-2">
              <p>Êtes-vous sûr de vouloir supprimer cette mission ?</p>
              <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-left">
                <div><strong>Chef de Groupe:</strong> {chefDeGroupeName}</div>
                <div><strong>Véhicule:</strong> {vanDisplayName}</div>
                <div><strong>Chauffeur:</strong> {driverName}</div>
              </div>
              <p className="text-red-600 font-medium">
                Cette action ne peut pas être annulée et libérera le véhicule pour d'autres missions.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isMobile ? 'flex-col gap-2' : ''}>
          <AlertDialogCancel 
            disabled={isLoading}
            className={isMobile ? 'w-full text-sm' : ''}
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={`bg-red-600 hover:bg-red-700 ${isMobile ? 'w-full text-sm' : ''}`}
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MissionDeleteDialog;

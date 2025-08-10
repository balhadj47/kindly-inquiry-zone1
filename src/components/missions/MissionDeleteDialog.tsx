
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
import { useVans } from '@/hooks/vans/useVansQuery';
import { useUsers } from '@/hooks/users/useUsersQuery';
import { getDriverName, getCompanyDisplayText } from './utils/missionCardUtils';

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
  const { data: users = [] } = useUsers();

  if (!mission) return null;

  const getVanDisplayName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId || v.reference_code === vanId);
    return van?.reference_code || vanId || 'Van inconnu';
  };

  const getMissionTitle = (mission: Trip) => {
    const driverName = getDriverName(mission, users);
    const companyDisplayText = getCompanyDisplayText(mission);
    const vanDisplayName = getVanDisplayName(mission.van);
    
    return isMobile 
      ? `${companyDisplayText} - ${vanDisplayName}`
      : `${companyDisplayText} - ${vanDisplayName} - ${driverName}`;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={isMobile ? 'w-[95vw] max-w-md' : ''}>
        <AlertDialogHeader>
          <AlertDialogTitle className={isMobile ? 'text-base' : ''}>
            Supprimer la mission
          </AlertDialogTitle>
          <AlertDialogDescription className={isMobile ? 'text-sm' : ''}>
            Êtes-vous sûr de vouloir supprimer la mission "{getMissionTitle(mission)}" ? 
            Cette action ne peut pas être annulée et libérera le véhicule pour d'autres missions.
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

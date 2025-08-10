
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

  if (!mission) return null;

  const getDriverInfo = (driverName: string) => {
    const roleMatch = driverName.match(/^(.+?)\s*\((.+?)\)$/);
    if (roleMatch) {
      const [, name, role] = roleMatch;
      return {
        name: name.trim(),
        role: role.trim(),
        firstName: name.trim().split(' ')[0]
      };
    }
    
    return {
      name: driverName,
      role: null,
      firstName: driverName.split(' ')[0]
    };
  };

  const getMissionTitle = (mission: Trip) => {
    const driverInfo = getDriverInfo(mission.driver);
    return isMobile 
      ? `${mission.company} - ${driverInfo.firstName}`
      : `${mission.company} - ${mission.branch} - ${driverInfo.firstName}`;
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

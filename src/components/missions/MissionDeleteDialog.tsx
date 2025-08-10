
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
    if (!driverName || driverName.trim() === '') {
      return {
        name: 'Conducteur non défini',
        role: null,
        firstName: 'Conducteur'
      };
    }

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
    const company = mission.company || 'Entreprise inconnue';
    const branch = mission.branch || 'Succursale inconnue';
    const driverInfo = getDriverInfo(mission.driver);
    
    return isMobile 
      ? `${company} - ${driverInfo.firstName}`
      : `${company} - ${branch} - ${driverInfo.firstName}`;
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

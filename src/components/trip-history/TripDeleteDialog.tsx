
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
import { type Trip } from '@/contexts/TripContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDateOnly } from '@/utils/dateUtils';

interface TripDeleteDialogProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const TripDeleteDialog: React.FC<TripDeleteDialogProps> = ({
  trip,
  isOpen,
  onClose,
  onConfirm
}) => {
  const isMobile = useIsMobile();

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

  const getTripTitle = (trip: Trip) => {
    const driverInfo = getDriverInfo(trip.driver);
    return isMobile 
      ? `${trip.company} - ${driverInfo.firstName}`
      : `${trip.company} - ${trip.branch} - ${driverInfo.firstName}`;
  };

  if (!trip) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={isMobile ? 'w-[95vw] max-w-md' : ''}>
        <AlertDialogHeader>
          <AlertDialogTitle className={isMobile ? 'text-base' : ''}>Supprimer le voyage</AlertDialogTitle>
          <AlertDialogDescription className={isMobile ? 'text-sm' : ''}>
            Êtes-vous sûr de vouloir supprimer le voyage "{getTripTitle(trip)}" du {formatDateOnly(trip.timestamp)} ? 
            Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isMobile ? 'flex-col gap-2' : ''}>
          <AlertDialogCancel className={isMobile ? 'w-full text-sm' : ''}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`bg-red-600 hover:bg-red-700 ${isMobile ? 'w-full text-sm' : ''}`}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TripDeleteDialog;

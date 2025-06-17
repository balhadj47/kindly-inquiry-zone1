
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Trip } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useVans } from '@/hooks/useVans';
import TripBasicInfo from './trip-details/TripBasicInfo';
import TripKilometers from './trip-details/TripKilometers';
import TripDestination from './trip-details/TripDestination';
import TripTeam from './trip-details/TripTeam';
import TripNotes from './trip-details/TripNotes';
import TripVanDetails from './trip-details/TripVanDetails';
import TripDuration from './trip-details/TripDuration';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripDetailsDialogProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
}

const TripDetailsDialog: React.FC<TripDetailsDialogProps> = ({
  trip,
  isOpen,
  onClose,
}) => {
  const { users } = useRBAC();
  const { vans } = useVans();
  const isMobile = useIsMobile();

  if (!trip) return null;

  const getTripTitle = (trip: Trip) => {
    const driverFirstName = trip.driver.split(' ')[0];
    return isMobile 
      ? `${trip.company} - ${driverFirstName}`
      : `${trip.company} - ${trip.branch} - ${driverFirstName}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'w-[95vw] max-w-md h-[90vh]' : 'max-w-3xl max-h-[85vh]'} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900`}>
            {getTripTitle(trip)}
          </DialogTitle>
        </DialogHeader>

        <div className={`space-y-4 ${isMobile ? 'space-y-3' : 'space-y-6'}`}>
          <TripBasicInfo trip={trip} />
          
          <TripVanDetails trip={trip} vans={vans} />
          
          <TripDuration trip={trip} />
          
          <TripKilometers trip={trip} />
          
          <TripDestination trip={trip} />
          
          <TripTeam trip={trip} users={users} />
          
          <TripNotes trip={trip} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsDialog;

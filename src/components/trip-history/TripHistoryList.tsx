
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Trip } from '@/contexts/TripContext';
import TripHistoryEmptyState from './TripHistoryEmptyState';
import TripCard from './TripCard';
import TripDeleteDialog from './TripDeleteDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripHistoryListProps {
  filteredTrips: Trip[];
  totalTrips: Trip[];
  onTripClick: (trip: Trip) => void;
  onDeleteTrip: (tripId: number) => Promise<void>;
  deletingTripId: number | null;
}

const TripHistoryList: React.FC<TripHistoryListProps> = ({
  filteredTrips,
  totalTrips,
  onTripClick,
  onDeleteTrip,
  deletingTripId
}) => {
  const isMobile = useIsMobile();
  const [deleteDialogTrip, setDeleteDialogTrip] = useState<Trip | null>(null);

  const handleDeleteTrip = (trip: Trip) => {
    setDeleteDialogTrip(trip);
  };

  const handleDeleteConfirm = () => {
    if (deleteDialogTrip) {
      onDeleteTrip(deleteDialogTrip.id);
      setDeleteDialogTrip(null);
    }
  };

  return (
    <>
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>
            Historique des Voyages ({filteredTrips.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTrips.length === 0 ? (
            <TripHistoryEmptyState 
              filteredTripsCount={filteredTrips.length}
              totalTripsCount={totalTrips.length}
            />
          ) : (
            filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onTripClick={onTripClick}
                onEndTrip={() => {}} // Remove end trip functionality
                onDeleteTrip={handleDeleteTrip}
                deletingTripId={deletingTripId}
              />
            ))
          )}
        </CardContent>
      </Card>

      <TripDeleteDialog
        trip={deleteDialogTrip}
        isOpen={!!deleteDialogTrip}
        onClose={() => setDeleteDialogTrip(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default TripHistoryList;

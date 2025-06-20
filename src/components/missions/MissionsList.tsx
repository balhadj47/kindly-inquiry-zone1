
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Trip } from '@/contexts/TripContext';
import MissionsEmptyState from './MissionsEmptyState';
import MissionCard from './MissionCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface MissionsListProps {
  filteredTrips: Trip[];
  totalTrips: Trip[];
  onTripClick: (trip: Trip) => void;
  onDeleteTrip: (trip: Trip) => void;
  onTerminateTrip: (trip: Trip) => void;
  deletingTripId: number | null;
  getVanDisplayName: (vanId: string) => string;
}

const MissionsList: React.FC<MissionsListProps> = ({
  filteredTrips,
  totalTrips,
  onTripClick,
  onDeleteTrip,
  onTerminateTrip,
  deletingTripId,
  getVanDisplayName
}) => {
  const isMobile = useIsMobile();

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>
          Missions ({filteredTrips.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredTrips.length === 0 ? (
          <MissionsEmptyState 
            filteredTripsCount={filteredTrips.length}
            totalTripsCount={totalTrips.length}
          />
        ) : (
          filteredTrips.map((trip) => (
            <MissionCard
              key={trip.id}
              trip={trip}
              onTripClick={onTripClick}
              onTerminateTrip={onTerminateTrip}
              onDeleteTrip={onDeleteTrip}
              deletingTripId={deletingTripId}
              getVanDisplayName={getVanDisplayName}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MissionsList;

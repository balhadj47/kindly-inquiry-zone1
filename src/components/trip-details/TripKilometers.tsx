
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripKilometersProps {
  trip: Trip;
}

const TripKilometers: React.FC<TripKilometersProps> = ({ trip }) => {
  const isMobile = useIsMobile();

  if (!trip.startKm && !trip.endKm) return null;

  return (
    <Card>
      <CardContent className={isMobile ? 'p-3' : 'p-4'}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 flex items-center`}>
          <MapPin className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2 text-orange-600`} />
          Informations Kilométriques
        </h3>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
          {trip.startKm && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-green-600`} />
              </div>
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Km Début</p>
                <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{trip.startKm.toLocaleString()} km</p>
              </div>
            </div>
          )}

          {trip.endKm && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <MapPin className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-red-600`} />
              </div>
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Km Fin</p>
                <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{trip.endKm.toLocaleString()} km</p>
              </div>
            </div>
          )}

          {trip.startKm && trip.endKm && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />
              </div>
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Distance</p>
                <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{(trip.endKm - trip.startKm)} km</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripKilometers;

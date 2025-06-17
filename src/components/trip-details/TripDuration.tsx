
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Timer } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripDurationProps {
  trip: Trip;
}

const TripDuration: React.FC<TripDurationProps> = ({ trip }) => {
  const isMobile = useIsMobile();

  const calculateDuration = () => {
    const startTime = new Date(trip.timestamp);
    const endTime = trip.endKm ? new Date() : new Date(); // For now, using current time as end
    
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTimeAgo = () => {
    const now = new Date();
    const tripTime = new Date(trip.timestamp);
    const diffInMinutes = Math.floor((now.getTime() - tripTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} heure${hours === 1 ? '' : 's'}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} jour${days === 1 ? '' : 's'}`;
    }
  };

  return (
    <Card>
      <CardContent className={isMobile ? 'p-3' : 'p-4'}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 flex items-center`}>
          <Timer className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2 text-indigo-600`} />
          Durée du Voyage
        </h3>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-indigo-600`} />
            </div>
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Durée estimée</p>
              <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{calculateDuration()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Timer className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />
            </div>
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Commencé il y a</p>
              <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{getTimeAgo()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${trip.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Timer className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${trip.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Statut</p>
              <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>
                {trip.status === 'active' ? 'En Mission' : 'Terminé'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripDuration;

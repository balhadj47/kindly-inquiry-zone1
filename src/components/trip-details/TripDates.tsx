
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripDatesProps {
  trip: Trip;
}

const TripDates: React.FC<TripDatesProps> = ({ trip }) => {
  const isMobile = useIsMobile();

  const formatPlannedDate = (date: Date) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  // Only show this section if there are planned dates
  if (!trip.startDate && !trip.endDate) {
    return null;
  }

  return (
    <Card>
      <CardContent className={isMobile ? 'p-3' : 'p-4'}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 flex items-center`}>
          <Calendar className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2 text-indigo-600`} />
          Dates Planifiées
        </h3>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
          {trip.startDate && (
            <div className="flex items-center space-x-3">
              <Calendar className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-green-600`} />
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Date de début</p>
                <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{formatPlannedDate(trip.startDate)}</p>
              </div>
            </div>
          )}

          {trip.endDate && (
            <div className="flex items-center space-x-3">
              <Calendar className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-red-600`} />
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Date de fin</p>
                <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{formatPlannedDate(trip.endDate)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripDates;

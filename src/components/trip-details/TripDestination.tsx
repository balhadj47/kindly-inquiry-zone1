
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, MapPin } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripDestinationProps {
  trip: Trip;
}

const TripDestination: React.FC<TripDestinationProps> = ({ trip }) => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardContent className={isMobile ? 'p-3' : 'p-4'}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 flex items-center`}>
          <Building2 className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2 text-indigo-600`} />
          Destination
        </h3>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
          <div className="flex items-center space-x-3">
            <Building2 className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-indigo-600`} />
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Entreprise</p>
              <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{trip.company}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-red-600`} />
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Succursale</p>
              <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{trip.branch}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripDestination;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, FileText, Car } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripBasicInfoProps {
  trip: Trip;
}

const TripBasicInfo: React.FC<TripBasicInfoProps> = ({ trip }) => {
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: isMobile ? 'short' : 'long',
      day: '2-digit',
      month: isMobile ? 'short' : 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDriverInfo = (driverName: string) => {
    const roleMatch = driverName.match(/^(.+?)\s*\((.+?)\)$/);
    if (roleMatch) {
      const [, name, role] = roleMatch;
      return { name: name.trim(), role: role.trim() };
    }
    return { name: driverName, role: null };
  };

  const driverInfo = getDriverInfo(trip.driver);

  return (
    <Card>
      <CardContent className={isMobile ? 'p-3' : 'p-4'}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 flex items-center`}>
          <FileText className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2 text-blue-600`} />
          Informations du Programme
        </h3>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
          <div className="flex items-center space-x-3">
            <Calendar className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Date</p>
              <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{formatDate(trip.timestamp)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-green-600`} />
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Heure</p>
              <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{formatTime(trip.timestamp)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Car className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-orange-600`} />
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Chauffeur</p>
              <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{driverInfo.name}</p>
              {driverInfo.role && (
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400`}>Rôle: {driverInfo.role}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripBasicInfo;

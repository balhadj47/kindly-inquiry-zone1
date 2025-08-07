
import React from 'react';
import { Clock, MapPin, Users, Car, Building } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { User } from '@/hooks/users/types';
import { getDriverName, getCompanyDisplayText } from '../utils/missionCardUtils';

interface MissionCardMetadataProps {
  mission: Trip;
  users: User[];
  getVanDisplayName: (vanId: string) => string;
}

const MissionCardMetadata: React.FC<MissionCardMetadataProps> = ({
  mission,
  users,
  getVanDisplayName
}) => {
  const driverName = getDriverName(mission, users);
  const companyDisplayText = getCompanyDisplayText(mission);

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2 text-xs text-gray-600">
        <Users className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">{driverName}</span>
      </div>
      
      <div className="flex items-center space-x-2 text-xs text-gray-600">
        <Car className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">{getVanDisplayName(mission.van)}</span>
      </div>

      <div className="flex items-center space-x-2 text-xs text-gray-600">
        <Building className="h-3 w-3 flex-shrink-0" />
        <span className="truncate" title={companyDisplayText}>{companyDisplayText}</span>
      </div>
      
      {(mission.startKm || mission.start_km) && (
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span>
            {mission.startKm || mission.start_km}
            {(mission.endKm || mission.end_km) ? ` → ${mission.endKm || mission.end_km}` : ''}
          </span>
        </div>
      )}
      
      {mission.destination && (
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{mission.destination}</span>
        </div>
      )}
    </div>
  );
};

export default MissionCardMetadata;

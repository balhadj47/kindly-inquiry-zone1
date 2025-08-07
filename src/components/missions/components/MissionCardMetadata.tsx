
import React from 'react';
import { Clock, MapPin, Users, Car } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { User } from '@/hooks/users/types';
import { getDriverName } from '../utils/missionCardUtils';

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

  const metadataItems = [
    {
      label: 'Chauffeur',
      value: driverName,
      icon: <Users className="h-4 w-4" />
    },
    {
      label: 'Véhicule',
      value: getVanDisplayName(mission.van),
      icon: <Car className="h-4 w-4" />
    },
    (mission.startKm || mission.start_km) && {
      label: 'Kilométrage',
      value: `${mission.startKm || mission.start_km}${
        (mission.endKm || mission.end_km) ? ` → ${mission.endKm || mission.end_km}` : ''
      }`,
      icon: <Clock className="h-4 w-4" />
    },
    mission.destination && {
      label: 'Destination',
      value: mission.destination,
      icon: <MapPin className="h-4 w-4" />
    }
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 gap-2 mb-4">
      {metadataItems.map((item, index) => item && (
        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
          {item.icon}
          <span className="font-medium">{item.label}:</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default MissionCardMetadata;

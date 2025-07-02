
import React from 'react';
import { MapPin } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';

interface MissionDestinationProps {
  mission: Trip;
}

const MissionDestination: React.FC<MissionDestinationProps> = ({ mission }) => {
  if (!mission.destination) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Destination</h3>
      </div>
      <p className="text-gray-700 leading-relaxed">{mission.destination}</p>
    </div>
  );
};

export default MissionDestination;

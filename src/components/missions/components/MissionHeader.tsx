
import React from 'react';
import { Circle } from 'lucide-react';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Trip } from '@/contexts/TripContext';
import { getStatusColor, getStatusText } from '../utils/missionStatusUtils';

interface MissionHeaderProps {
  mission: Trip;
}

const MissionHeader: React.FC<MissionHeaderProps> = ({ mission }) => {
  // Get meaningful title - prefer mission ID over N/A company
  const getTitle = () => {
    if (mission.company && mission.company !== 'N/A') {
      return mission.company;
    }
    return `Mission #${mission.id}`;
  };

  // Get meaningful subtitle - show branch if available, otherwise show van info
  const getSubtitle = () => {
    if (mission.branch && mission.branch !== 'N/A') {
      return mission.branch;
    }
    // You could also show destination or van info as fallback
    if (mission.destination) {
      return `Destination: ${mission.destination}`;
    }
    return `Mission créée le ${new Date(mission.created_at || mission.timestamp).toLocaleDateString('fr-FR')}`;
  };

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <DialogTitle className="text-2xl font-semibold text-gray-900">
          {getTitle()}
        </DialogTitle>
        <DialogDescription className="text-base text-gray-600">
          {getSubtitle()}
        </DialogDescription>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Circle className={`h-2.5 w-2.5 fill-current ${
            mission.status === 'active' ? 'text-emerald-500' : 
            mission.status === 'completed' ? 'text-blue-500' : 
            mission.status === 'terminated' ? 'text-red-500' : 'text-gray-500'
          }`} />
          <span className={`text-sm font-medium ${getStatusColor(mission.status || 'active')}`}>
            {getStatusText(mission.status || 'active')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MissionHeader;

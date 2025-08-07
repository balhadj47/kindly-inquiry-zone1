
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/contexts/TripContext';
import { Van } from '@/types/van';
import { getMissionTitle, getStatusConfig } from '../utils/missionCardUtils';

interface MissionCardHeaderProps {
  mission: Trip;
  vans: Van[];
}

const MissionCardHeader: React.FC<MissionCardHeaderProps> = ({
  mission,
  vans
}) => {
  const title = getMissionTitle(mission, vans);
  const statusConfig = getStatusConfig(mission.status || 'active');

  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <Badge variant={statusConfig.variant as any} className="ml-2">
        {statusConfig.label}
      </Badge>
    </div>
  );
};

export default MissionCardHeader;

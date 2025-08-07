
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
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
      </div>
      <Badge variant={statusConfig.variant as any} className="ml-2 text-xs">
        {statusConfig.label}
      </Badge>
    </div>
  );
};

export default MissionCardHeader;

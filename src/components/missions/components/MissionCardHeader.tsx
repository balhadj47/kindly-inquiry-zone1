
import React from 'react';
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

  return {
    title,
    status: {
      label: statusConfig.label,
      variant: statusConfig.variant,
      color: statusConfig.color
    }
  };
};

export default MissionCardHeader;

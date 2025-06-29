
import React from 'react';
import { Trip } from '@/contexts/TripContext';
import MissionsListContainer from './MissionsListContainer';

interface MissionsListProps {
  missions: Trip[];
  searchTerm: string;
  statusFilter: string;
  onEditMission: (mission: Trip) => void;
  onDeleteMission: (mission: Trip) => void;
  onTerminateMission: (mission: Trip) => void;
  canEdit: boolean;
  canDelete: boolean;
  actionLoading: string | null;
}

const MissionsList: React.FC<MissionsListProps> = (props) => {
  return <MissionsListContainer {...props} />;
};

export default MissionsList;

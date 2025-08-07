
import React from 'react';
import { Trip } from '@/contexts/TripContext';
import MissionCardWithTermination from './MissionCardWithTermination';
import MissionsEmptyState from './MissionsEmptyState';

interface MissionListProps {
  missions: Trip[];
  searchTerm: string;
  statusFilter: string;
  onMissionClick: (mission: Trip) => void;
  onDeleteClick: (mission: Trip) => void;
  getVanDisplayName: (vanId: string) => string;
  actionLoading: string | null;
}

const MissionList: React.FC<MissionListProps> = ({
  missions,
  searchTerm,
  statusFilter,
  onMissionClick,
  onDeleteClick,
  getVanDisplayName,
  actionLoading,
}) => {
  if (missions.length === 0) {
    return (
      <MissionsEmptyState 
        searchTerm={searchTerm} 
        statusFilter={statusFilter} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {missions.map((mission) => (
        <MissionCardWithTermination
          key={mission.id}
          mission={mission}
          onMissionClick={onMissionClick}
          onDeleteClick={onDeleteClick}
          getVanDisplayName={getVanDisplayName}
          actionLoading={actionLoading}
        />
      ))}
    </div>
  );
};

export default MissionList;

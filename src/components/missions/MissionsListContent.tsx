
import React, { useCallback } from 'react';
import { Trip } from '@/contexts/TripContext';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import MissionCard from './MissionCard';
import MissionsEmptyState from './MissionsEmptyState';
import OptimizedVirtualList from '@/components/ui/optimized-virtual-list';

interface MissionsListContentProps {
  filteredMissions: Trip[];
  searchTerm: string;
  statusFilter: string;
  canEdit: boolean;
  canDelete: boolean;
  actionLoading: string | null;
  deletingMissionId: number | null;
  isTerminating: boolean;
  terminateMission: Trip | null;
  getVanDisplayName: (vanId: string) => string;
  onMissionClick: (mission: Trip) => void;
  onTerminateClick: (mission: Trip) => void;
  onDeleteClick: (mission: Trip) => void;
}

const MissionsListContent: React.FC<MissionsListContentProps> = ({
  filteredMissions,
  searchTerm,
  statusFilter,
  canEdit,
  canDelete,
  actionLoading,
  deletingMissionId,
  isTerminating,
  terminateMission,
  getVanDisplayName,
  onMissionClick,
  onTerminateClick,
  onDeleteClick,
}) => {
  usePerformanceMonitor('MissionsListContent');

  const renderMissionItem = useCallback((mission: Trip, index: number) => (
    <MissionCard
      key={mission.id}
      mission={mission}
      onMissionClick={onMissionClick}
      onTerminateClick={onTerminateClick}
      onDeleteClick={onDeleteClick}
      getVanDisplayName={getVanDisplayName}
      canEdit={canEdit}
      canDelete={canDelete}
      actionLoading={deletingMissionId === mission.id ? 'loading' : null}
      isTerminating={isTerminating && terminateMission?.id === mission.id}
    />
  ), [
    onMissionClick,
    onTerminateClick,
    onDeleteClick,
    getVanDisplayName,
    canEdit,
    canDelete,
    deletingMissionId,
    isTerminating,
    terminateMission?.id
  ]);

  if (filteredMissions.length === 0) {
    return (
      <MissionsEmptyState 
        searchTerm={searchTerm} 
        statusFilter={statusFilter} 
      />
    );
  }

  return (
    <>
      {/* Use virtual scrolling for large datasets */}
      {filteredMissions.length > 20 ? (
        <OptimizedVirtualList
          items={filteredMissions}
          height={600}
          itemHeight={170}
          renderItem={renderMissionItem}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMissions.map((mission, index) => renderMissionItem(mission, index))}
        </div>
      )}
    </>
  );
};

export default MissionsListContent;

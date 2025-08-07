
import React from 'react';
import { Trip } from '@/contexts/TripContext';
import { useMissionsListLogic } from './MissionsListLogic';
import MissionsListContent from './MissionsListContent';
import MissionDetailsDialog from './MissionDetailsDialog';

interface MissionsListContainerProps {
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

const MissionsListContainer: React.FC<MissionsListContainerProps> = ({
  missions,
  searchTerm,
  statusFilter,
  onEditMission,
  onDeleteMission,
  onTerminateMission,
  canEdit,
  canDelete,
  actionLoading,
}) => {
  const {
    selectedMission,
    setSelectedMission,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    deletingMissionId,
    setDeletingMissionId,
    filteredMissions,
    getVanDisplayName,
  } = useMissionsListLogic(missions, searchTerm, statusFilter);

  return (
    <>
      <MissionsListContent
        filteredMissions={filteredMissions}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        canEdit={canEdit}
        canDelete={canDelete}
        actionLoading={actionLoading}
        deletingMissionId={deletingMissionId}
        isTerminating={false} // No longer managed here
        terminateMission={null} // No longer managed here
        getVanDisplayName={getVanDisplayName}
        onMissionClick={(mission) => {
          setSelectedMission(mission);
          setIsDetailsDialogOpen(true);
        }}
        onTerminateClick={(mission) => {
          console.log('🔧 MissionsList: Requesting terminate for mission:', mission.id);
          onTerminateMission(mission);
        }}
        onDeleteClick={(mission) => {
          console.log('🗑️ MissionsList: Requesting delete confirmation for mission:', mission.id);
          onDeleteMission(mission);
        }}
      />

      {selectedMission && (
        <MissionDetailsDialog
          mission={selectedMission}
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedMission(null);
          }}
          getVanDisplayName={getVanDisplayName}
        />
      )}
    </>
  );
};

export default MissionsListContainer;

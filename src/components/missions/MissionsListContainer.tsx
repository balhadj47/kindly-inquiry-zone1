
import React from 'react';
import { Trip } from '@/contexts/TripContext';
import { useMissionsListLogic } from './MissionsListLogic';
import { useEndMissionFlow } from '@/hooks/missions/useEndMissionFlow';
import MissionsListContent from './MissionsListContent';
import MissionDetailsDialog from './MissionDetailsDialog';
import MissionEndConfirmationDialog from './MissionEndConfirmationDialog';
import MissionTerminateDialog from './MissionTerminateDialog';

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

  const {
    selectedMission: endMission,
    showConfirmation,
    showDialog,
    finalKm,
    isEnding,
    setFinalKm,
    initiateEndMission,
    confirmEndMission,
    cancelEndMission,
    validateAndEndMission,
  } = useEndMissionFlow();

  // Enhanced terminate handler that properly calls parent function
  const handleTerminateClick = (mission: Trip) => {
    console.log('🎯 MissionsListContainer: handleTerminateClick called with mission:', mission.id);
    initiateEndMission(mission);
  };

  // Handle successful mission termination
  const handleMissionTerminated = async () => {
    if (endMission) {
      console.log('🎯 MissionsListContainer: Mission terminated successfully:', endMission.id);
      try {
        await validateAndEndMission();
        // Call parent termination handler
        onTerminateMission(endMission);
      } catch (error) {
        console.error('🎯 MissionsListContainer: Error in mission termination:', error);
      }
    }
  };

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
        isTerminating={isEnding}
        terminateMission={endMission}
        getVanDisplayName={getVanDisplayName}
        onMissionClick={(mission) => {
          setSelectedMission(mission);
          setIsDetailsDialogOpen(true);
        }}
        onTerminateClick={handleTerminateClick}
        onDeleteClick={(mission) => {
          onDeleteMission(mission);
        }}
      />

      <MissionEndConfirmationDialog
        mission={endMission}
        isOpen={showConfirmation}
        onConfirm={confirmEndMission}
        onCancel={cancelEndMission}
      />

      <MissionTerminateDialog
        isOpen={showDialog}
        mission={endMission}
        finalKm={finalKm}
        isTerminating={isEnding}
        onClose={cancelEndMission}
        onFinalKmChange={setFinalKm}
        onSubmit={handleMissionTerminated}
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


import React from 'react';
import { Trip } from '@/contexts/TripContext';
import { useMissionsListLogic } from './MissionsListLogic';
import { TripBusinessLogic } from '@/services/tripBusinessLogic';
import MissionsListContent from './MissionsListContent';
import MissionDetailsDialog from './MissionDetailsDialog';
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
    showTerminatePrompt,
    setShowTerminatePrompt,
    terminateMission,
    setTerminateMission,
    finalKm,
    setFinalKm,
    isTerminating,
    setIsTerminating,
    deletingMissionId,
    setDeletingMissionId,
    filteredMissions,
    getVanDisplayName,
    updateTrip,
    deleteTrip,
    toast
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
        isTerminating={isTerminating}
        terminateMission={terminateMission}
        getVanDisplayName={getVanDisplayName}
        onMissionClick={(mission) => {
          setSelectedMission(mission);
          setIsDetailsDialogOpen(true);
        }}
        onDeleteClick={(mission) => {
          console.log('🗑️ MissionsList: Requesting delete confirmation for mission:', mission.id);
          onDeleteMission(mission);
        }}
      />

      <MissionTerminateDialog
        isOpen={showTerminatePrompt}
        mission={terminateMission}
        finalKm={finalKm}
        isTerminating={isTerminating}
        onClose={() => {
          setShowTerminatePrompt(false);
          setTerminateMission(null);
          setFinalKm('');
        }}
        onFinalKmChange={setFinalKm}
        onSubmit={async () => {
          if (!terminateMission) return;

          // Use business logic for validation
          const validation = TripBusinessLogic.validateTripTermination(
            terminateMission,
            finalKm,
            null // Current user would be passed here
          );

          if (!validation.isValid) {
            toast({
              title: 'Erreur',
              description: validation.errorMessage,
              variant: 'destructive',
            });
            return;
          }

          const kmNumber = parseInt(finalKm, 10);
          setIsTerminating(true);
          
          try {
            await updateTrip.mutateAsync({
              id: terminateMission.id.toString(),
              end_km: kmNumber,
              status: 'completed'
            });
            
            toast({
              title: 'Succès',
              description: 'Mission terminée avec succès',
            });
            
            setShowTerminatePrompt(false);
            setTerminateMission(null);
            setFinalKm('');
            
            if (onTerminateMission) {
              onTerminateMission(terminateMission);
            }
          } catch (error) {
            console.error('Error terminating mission:', error);
            toast({
              title: 'Erreur',
              description: 'Impossible de terminer la mission',
              variant: 'destructive',
            });
          } finally {
            setIsTerminating(false);
          }
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

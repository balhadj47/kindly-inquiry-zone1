
import React from 'react';
import { Trip } from '@/contexts/TripContext';
import { useMissionsListLogic } from './MissionsListLogic';
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
        onTerminateClick={(mission) => {
          setTerminateMission(mission);
          setShowTerminatePrompt(true);
          setFinalKm('');
        }}
        onDeleteClick={async (mission) => {
          console.log('🗑️ MissionsList: Starting delete for mission:', mission.id);
          
          if (deletingMissionId === mission.id) {
            console.log('🗑️ MissionsList: Already deleting this mission');
            return;
          }

          setDeletingMissionId(mission.id);
          
          try {
            await deleteTrip.mutateAsync(mission.id.toString());
            console.log('🗑️ MissionsList: Mission deleted successfully:', mission.id);
            
            if (onDeleteMission) {
              onDeleteMission(mission);
            }
          } catch (error) {
            console.error('🗑️ MissionsList: Error deleting mission:', error);
            toast({
              title: 'Erreur',
              description: 'Impossible de supprimer la mission',
              variant: 'destructive',
            });
          } finally {
            setDeletingMissionId(null);
          }
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
          if (!terminateMission || !finalKm) {
            toast({
              title: 'Erreur',
              description: 'Veuillez saisir le kilométrage final',
              variant: 'destructive',
            });
            return;
          }

          const kmNumber = parseInt(finalKm, 10);
          if (isNaN(kmNumber) || kmNumber < 0) {
            toast({
              title: 'Erreur',
              description: 'Veuillez saisir un kilométrage valide',
              variant: 'destructive',
            });
            return;
          }

          if (terminateMission.start_km && kmNumber < terminateMission.start_km) {
            toast({
              title: 'Erreur',
              description: 'Le kilométrage final ne peut pas être inférieur au kilométrage initial',
              variant: 'destructive',
            });
            return;
          }

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

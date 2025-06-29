
import React, { useCallback } from 'react';
import { Trip } from '@/contexts/TripContext';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useMissionsListLogic } from './MissionsListLogic';
import MissionDetailsDialog from './MissionDetailsDialog';
import MissionCard from './MissionCard';
import MissionTerminateDialog from './MissionTerminateDialog';
import MissionsEmptyState from './MissionsEmptyState';
import OptimizedVirtualList from '@/components/ui/optimized-virtual-list';

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

const MissionsList: React.FC<MissionsListProps> = ({
  missions,
  searchTerm: externalSearchTerm,
  statusFilter,
  onEditMission,
  onDeleteMission,
  onTerminateMission,
  canEdit,
  canDelete,
  actionLoading,
}) => {
  usePerformanceMonitor('MissionsList');

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
  } = useMissionsListLogic(missions, externalSearchTerm, statusFilter);

  const handleMissionClick = (mission: Trip) => {
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedMission(null);
  };

  const handleTerminateClick = (mission: Trip) => {
    setTerminateMission(mission);
    setShowTerminatePrompt(true);
    setFinalKm('');
  };

  const handleTerminateSubmit = async () => {
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
  };

  const handleCloseTerminatePrompt = () => {
    setShowTerminatePrompt(false);
    setTerminateMission(null);
    setFinalKm('');
  };

  const handleDeleteClick = async (mission: Trip) => {
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
  };

  const renderMissionItem = useCallback((mission: Trip, index: number) => (
    <MissionCard
      key={mission.id}
      mission={mission}
      onMissionClick={handleMissionClick}
      onTerminateClick={handleTerminateClick}
      onDeleteClick={handleDeleteClick}
      getVanDisplayName={getVanDisplayName}
      canEdit={canEdit}
      canDelete={canDelete}
      actionLoading={deletingMissionId === mission.id ? 'loading' : null}
      isTerminating={isTerminating && terminateMission?.id === mission.id}
    />
  ), [
    handleMissionClick,
    handleTerminateClick,
    handleDeleteClick,
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
        searchTerm={externalSearchTerm} 
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
          itemHeight={180}
          renderItem={renderMissionItem}
          className="space-y-4"
        />
      ) : (
        <div className="space-y-4">
          {filteredMissions.map((mission, index) => renderMissionItem(mission, index))}
        </div>
      )}

      <MissionTerminateDialog
        isOpen={showTerminatePrompt}
        mission={terminateMission}
        finalKm={finalKm}
        isTerminating={isTerminating}
        onClose={handleCloseTerminatePrompt}
        onFinalKmChange={setFinalKm}
        onSubmit={handleTerminateSubmit}
      />

      {selectedMission && (
        <MissionDetailsDialog
          mission={selectedMission}
          isOpen={isDetailsDialogOpen}
          onClose={handleCloseDialog}
          getVanDisplayName={getVanDisplayName}
        />
      )}
    </>
  );
};

export default MissionsList;


import React, { useState, useCallback } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMissionsPermissions } from '@/hooks/useMissionsPermissions';
import { useMissionsActionsOptimized } from './useMissionsActionsOptimized';
import { useTripWizardDialog } from '@/hooks/useTripWizardDialog';
import { useDialogState } from '@/hooks/useDialogState';
import { useRealtimeCache } from '@/hooks/useRealtimeCache';
import { useMissionsData, useFilteredMissions } from './hooks/useMissionsData';
import { useMissionsDialogs } from './hooks/useMissionsDialogs';
import MissionsFilters from './MissionsFilters';
import MissionsList from './MissionsList';
import NewTripDialog from '@/components/NewTripDialog';
import MissionTerminateDialog from './MissionTerminateDialog';
import MissionDeleteDialog from './MissionDeleteDialog';
import { Trip } from '@/contexts/TripContext';

const MissionsContainerOptimized = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { invalidateAll } = useRealtimeCache();
  
  const {
    handleDeleteMission,
    handleTerminateMission,
    isLoading: isActionLoading
  } = useMissionsActionsOptimized();

  const { 
    dialogState: detailsDialog,
    openDialog: openDetailsDialog,
    closeDialog: closeDetailsDialog
  } = useDialogState<Trip>();

  const permissions = useMissionsPermissions();

  const {
    isOpen: isNewTripOpen,
    openDialog: openNewTrip,
    closeDialog: closeNewTrip
  } = useTripWizardDialog();

  const {
    data: tripsData,
    isLoading,
    error,
    refetch,
    isFetching
  } = useMissionsData();

  const filteredMissions = useFilteredMissions(tripsData, searchTerm, statusFilter);

  const {
    terminateDialog,
    deleteDialog,
    handleTerminateClick,
    handleTerminateClose,
    handleDeleteClick,
    handleDeleteClose,
  } = useMissionsDialogs();

  const handleEditMission = useCallback((mission: Trip) => {
    openDetailsDialog(mission);
  }, [openDetailsDialog]);

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteDialog.mission) {
      await handleDeleteMission(deleteDialog.mission);
      handleDeleteClose();
    }
  }, [deleteDialog.mission, handleDeleteMission, handleDeleteClose]);

  const handleTerminateConfirm = useCallback(async (mission: Trip, finalKm: number) => {
    await handleTerminateMission(mission, finalKm);
  }, [handleTerminateMission]);

  const handleRefresh = useCallback(async () => {
    await refetch();
    invalidateAll();
  }, [refetch, invalidateAll]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des missions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Erreur lors du chargement des missions</p>
        <Button onClick={handleRefresh} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Missions</h1>
          <p className="text-gray-600 mt-2">
            Gérer et suivre toutes les missions en cours
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          {permissions.canCreate && (
            <Button 
              onClick={openNewTrip}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle Mission
            </Button>
          )}
        </div>
      </div>

      <MissionsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        clearFilters={() => {
          setSearchTerm('');
          setStatusFilter('all');
        }}
        missions={filteredMissions}
      />
      
      <MissionsList
        missions={filteredMissions}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onEditMission={handleEditMission}
        onDeleteMission={handleDeleteClick}
        onTerminateMission={handleTerminateClick}
        canEdit={permissions.canEdit}
        canDelete={permissions.canDelete}
        actionLoading={isActionLoading ? 'loading' : null}
      />

      {isNewTripOpen && (
        <NewTripDialog
          isOpen={isNewTripOpen}
          onClose={closeNewTrip}
        />
      )}

      <MissionTerminateDialog
        mission={terminateDialog.mission}
        isOpen={terminateDialog.isOpen}
        onClose={handleTerminateClose}
        onConfirm={handleTerminateConfirm}
        isLoading={isActionLoading}
      />

      <MissionDeleteDialog
        mission={deleteDialog.mission}
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default MissionsContainerOptimized;

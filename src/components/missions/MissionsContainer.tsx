import React, { useState, useCallback } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrips } from '@/hooks/trips/useTripsQuery';
import { useMissions } from '@/hooks/useMissions';
import { useMissionsPermissions } from '@/hooks/useMissionsPermissions';
import { useMissionsActions } from './useMissionsActions';
import { useTripWizardDialog } from '@/hooks/useTripWizardDialog';
import MissionsFilters from './MissionsFilters';
import MissionsList from './MissionsList';
import NewTripDialog from '@/components/NewTripDialog';
import MissionTerminateDialog from './MissionTerminateDialog';
import { Trip } from '@/contexts/TripContext';
import { transformTripsToContextFormat } from '@/utils/tripDataTransformer';

const MissionsContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [terminateDialog, setTerminateDialog] = useState<{
    isOpen: boolean;
    mission: Trip | null;
  }>({ isOpen: false, mission: null });

  const { data: tripsData, isLoading: loading, error } = useTrips();
  const missions = transformTripsToContextFormat(tripsData?.trips || []);
  const { 
    selectedMission, 
    setSelectedMission,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen 
  } = useMissions();
  const permissions = useMissionsPermissions();
  const {
    isRefreshing,
    handleRefresh,
    handleDeleteMission,
    handleTerminateMission
  } = useMissionsActions();

  const {
    isOpen: isNewTripOpen,
    openDialog: openNewTrip,
    closeDialog: closeNewTrip
  } = useTripWizardDialog();

  const handleEditMission = useCallback((mission: Trip) => {
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
  }, [setSelectedMission, setIsDetailsDialogOpen]);

  const handleTerminateClick = useCallback((mission: Trip) => {
    setTerminateDialog({
      isOpen: true,
      mission
    });
  }, []);

  const handleTerminateConfirm = useCallback(async (mission: Trip, finalKm: number) => {
    await handleTerminateMission(mission, finalKm);
  }, [handleTerminateMission]);

  const handleTerminateClose = useCallback(() => {
    setTerminateDialog({
      isOpen: false,
      mission: null
    });
  }, []);

  if (loading) {
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
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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
        missions={missions}
      />
      
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Erreur lors du chargement des missions</p>
          <Button onClick={handleRefresh} variant="outline">
            Réessayer
          </Button>
        </div>
      ) : (
        <MissionsList
          missions={missions}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onEditMission={handleEditMission}
          onDeleteMission={handleDeleteMission}
          onTerminateMission={handleTerminateClick}
          canEdit={permissions.canEdit}
          canDelete={permissions.canDelete}
          actionLoading={isRefreshing ? 'loading' : null}
        />
      )}

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
        isLoading={isRefreshing}
      />
    </div>
  );
};

export default MissionsContainer;

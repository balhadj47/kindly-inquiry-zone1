import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMissionsPermissions } from '@/hooks/useMissionsPermissions';
import { useMissionsActionsOptimized } from './useMissionsActionsOptimized';
import { useTripWizardDialog } from '@/hooks/useTripWizardDialog';
import { useDialogState } from '@/hooks/useDialogState';
import { useRealtimeCache } from '@/hooks/useRealtimeCache';
import MissionsFilters from './MissionsFilters';
import MissionsList from './MissionsList';
import NewTripDialog from '@/components/NewTripDialog';
import MissionTerminateDialog from './MissionTerminateDialog';
import { Trip } from '@/contexts/TripContext';
import { transformTripsToContextFormat } from '@/utils/tripDataTransformer';

const MissionsContainerOptimized = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [terminateDialog, setTerminateDialog] = useState<{
    isOpen: boolean;
    mission: Trip | null;
  }>({ isOpen: false, mission: null });

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
  } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trips:', error);
        throw error;
      }

      return data;
    },
    select: (data) => {
      return transformTripsToContextFormat(data);
    },
  });

  const handleEditMission = useCallback((mission: Trip) => {
    openDetailsDialog(mission);
  }, [openDetailsDialog]);

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

  const handleRefresh = useCallback(async () => {
    await refetch();
    invalidateAll();
  }, [refetch, invalidateAll]);

  const filteredMissions = useMemo(() => {
    if (!tripsData) return [];

    let filtered = [...tripsData];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(mission =>
        mission.company?.toLowerCase().includes(term) ||
        mission.branch?.toLowerCase().includes(term) ||
        mission.driver?.toLowerCase().includes(term) ||
        mission.van?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(mission => mission.status === statusFilter);
    }

    return filtered;
  }, [tripsData, searchTerm, statusFilter]);

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
        onDeleteMission={handleDeleteMission}
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
    </div>
  );
};

export default MissionsContainerOptimized;

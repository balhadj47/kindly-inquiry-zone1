
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFastVanData } from '@/hooks/useFastVanData';
import { useMissionsPermissions } from './MissionsPermissions';
import { useMissionsActionsOptimized } from './useMissionsActionsOptimized';
import { useTripMutationsOptimized } from '@/hooks/trips/useTripMutationsOptimized';
import { useVanRefreshService } from '@/hooks/useVanRefreshService';
import { useRealtimeCache } from '@/hooks/useRealtimeCache';
import MissionsHeader from './MissionsHeader';
import MissionsFilters from './MissionsFilters';
import MissionsList from './MissionsList';
import NewTripDialog from '@/components/NewTripDialog';
import MissionActionDialog from './MissionActionDialog';
import { Trip } from '@/contexts/TripContext';

const transformDatabaseToTrip = (databaseTrip: any): Trip => ({
  id: parseInt(databaseTrip.id),
  van: databaseTrip.van || '',
  driver: databaseTrip.driver || '',
  company: databaseTrip.company || '',
  branch: databaseTrip.branch || '',
  startDate: databaseTrip.planned_start_date ? new Date(databaseTrip.planned_start_date) : undefined,
  endDate: databaseTrip.planned_end_date ? new Date(databaseTrip.planned_end_date) : undefined,
  startKm: databaseTrip.start_km || 0,
  endKm: databaseTrip.end_km || null,
  destination: databaseTrip.destination || '',
  notes: databaseTrip.notes || '',
  created_at: databaseTrip.created_at || new Date().toISOString(),
  updated_at: databaseTrip.updated_at || new Date().toISOString(),
  status: databaseTrip.status || 'active',
  userIds: databaseTrip.user_ids || [],
  userRoles: databaseTrip.user_roles || [],
  timestamp: databaseTrip.created_at || new Date().toISOString(),
  companies_data: databaseTrip.companies_data || [],
});

const MissionsContainerOptimized = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewMissionDialogOpen, setIsNewMissionDialogOpen] = useState(false);

  const { user: authUser } = useAuth();
  const { isVanDataCached } = useFastVanData();
  const { forceRefreshVans } = useVanRefreshService();
  const permissions = useMissionsPermissions();
  const { createTrip } = useTripMutationsOptimized();
  
  // Initialize real-time cache invalidation
  const { invalidateAll } = useRealtimeCache();
  
  const {
    actionDialog,
    setActionDialog,
    handleDeleteMission,
    handleTerminateMission,
    handleActionConfirm,
    isLoading: isActionLoading
  } = useMissionsActionsOptimized();

  // Use React Query for trips data with improved caching
  const { data: trips = [], isLoading, error, refetch } = useQuery({
    queryKey: ['trips'],
    queryFn: async (): Promise<Trip[]> => {
      console.log('🚗 Fetching trips with React Query...');
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('trips')
        .select(`
          id,
          van,
          driver,
          company,
          branch,
          created_at,
          notes,
          user_ids,
          user_roles,
          start_km,
          end_km,
          status,
          planned_start_date,
          planned_end_date,
          companies_data
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trips:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚗 Fetched trips in:', endTime - startTime, 'ms');
      
      return (data || []).map(transformDatabaseToTrip);
    },
    staleTime: 5000, // 5 seconds for mission-critical data
    gcTime: 30000, // Keep in cache for 30 seconds
    refetchOnWindowFocus: true, // Enable window focus refetch
  });

  const showVanLoadingWarning = !isVanDataCached();

  const handleAddMission = () => {
    setIsNewMissionDialogOpen(true);
  };

  const handleEditMission = (mission: Trip) => {
    // Implementation for edit functionality
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    
    // Use the cache invalidation system for coordinated refresh
    await Promise.all([
      refetch(),
      forceRefreshVans(),
      invalidateAll()
    ]);
    
    console.log('✅ Manual refresh completed');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des missions...</div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Authentification requise</h2>
        <p className="text-gray-600">Vous devez être connecté pour accéder aux missions.</p>
      </div>
    );
  }

  // Check for permission errors
  const getErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as any).message);
    }
    return '';
  };

  const showPermissionError = error && getErrorMessage(error).includes('Insufficient permissions');

  if (showPermissionError || !permissions.canRead) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <MissionsHeader missionsCount={0} />
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Permissions insuffisantes</strong>
            <br />
            Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité.
            Seuls les utilisateurs autorisés peuvent gérer les missions.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {showVanLoadingWarning && (
        <Alert className="border-blue-200 bg-blue-50 mb-6">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Données des véhicules en cours de chargement pour optimiser les performances...
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <MissionsHeader missionsCount={trips.filter(trip => trip.status === 'active').length} />
          <div className="flex items-center gap-3">
            {permissions.canCreate && (
              <Button 
                onClick={handleAddMission} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Mission
              </Button>
            )}
            <Button 
              onClick={handleRefresh} 
              disabled={isLoading}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <MissionsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          clearFilters={clearFilters}
          missions={trips}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <MissionsList
            missions={trips}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onEditMission={handleEditMission}
            onDeleteMission={handleDeleteMission}
            onTerminateMission={handleTerminateMission}
            canEdit={permissions.canEdit}
            canDelete={permissions.canDelete}
            actionLoading={isActionLoading ? 'loading' : null}
          />
        </div>
      </div>

      {permissions.canCreate && (
        <NewTripDialog
          isOpen={isNewMissionDialogOpen}
          onClose={() => setIsNewMissionDialogOpen(false)}
        />
      )}

      <MissionActionDialog
        mission={actionDialog.mission}
        action={actionDialog.action}
        isOpen={actionDialog.isOpen}
        onClose={() => setActionDialog({ isOpen: false, mission: null, action: null })}
        onConfirm={handleActionConfirm}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default MissionsContainerOptimized;


import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTrip } from '@/contexts/TripContext';
import { useFastVanData } from '@/hooks/useFastVanData';
import { useMissionsPermissions } from './MissionsPermissions';
import { useMissionsActions } from './useMissionsActions';
import MissionsHeader from './MissionsHeader';
import MissionsFilters from './MissionsFilters';
import MissionsList from './MissionsList';
import NewTripDialog from '@/components/NewTripDialog';
import MissionActionDialog from './MissionActionDialog';
import { Trip } from '@/contexts/TripContext';

const MissionsContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewMissionDialogOpen, setIsNewMissionDialogOpen] = useState(false);

  const { user: authUser } = useAuth();
  const { trips, loading, error } = useTrip();
  const { isVanDataCached } = useFastVanData();
  const permissions = useMissionsPermissions();
  const {
    isRefreshing,
    actionDialog,
    setActionDialog,
    handleRefresh,
    handleDeleteMission,
    handleTerminateMission,
    handleActionConfirm
  } = useMissionsActions();

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

  if (loading) {
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

  const showPermissionError = error && typeof error === 'string' && error.includes('Insufficient permissions');

  if (showPermissionError || !permissions.canRead) {
    return (
      <div className="h-full flex flex-col">
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 mb-6">
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

      {/* Fixed Header Section */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <MissionsHeader missionsCount={trips?.length || 0} />
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
              disabled={isRefreshing}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Fixed Filters Section */}
      <div className="flex-shrink-0 mb-6">
        <MissionsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          clearFilters={clearFilters}
          missions={trips || []}
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <MissionsList
            missions={trips || []}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onEditMission={handleEditMission}
            onDeleteMission={handleDeleteMission}
            onTerminateMission={handleTerminateMission}
            canEdit={permissions.canEdit}
            canDelete={permissions.canDelete}
            actionLoading={isRefreshing ? 'loading' : null}
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
        isLoading={isRefreshing}
      />
    </div>
  );
};

export default MissionsContainer;

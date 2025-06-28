
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTrip } from '@/contexts/TripContext';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';
import MissionsHeader from './MissionsHeader';
import MissionsFilters from './MissionsFilters';
import MissionsList from './MissionsList';
import NewTripDialog from '@/components/NewTripDialog';
import MissionActionDialog from './MissionActionDialog';
import { Trip } from '@/contexts/TripContext';

const MissionsContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNewMissionDialogOpen, setIsNewMissionDialogOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    mission: Trip | null;
    action: 'delete' | 'terminate' | null;
  }>({
    isOpen: false,
    mission: null,
    action: null
  });
  const [permissions, setPermissions] = useState({
    canRead: false,
    canCreate: false,
    canEdit: false,
    canDelete: false
  });

  const { user: authUser } = useAuth();
  const { hasPermission, roles, currentUser } = useRBAC();
  const { trips, loading, error, refetch } = useTrip();
  const { refreshPage } = useCacheRefresh();

  // Check permissions when component mounts
  useEffect(() => {
    const checkPermissions = async () => {
      // Dynamic privilege detection
      const isHighPrivilegeUser = () => {
        if (!currentUser?.role_id || !roles) return false;
        
        const userRole = roles.find(role => (role as any).role_id === currentUser.role_id);
        if (!userRole) return false;
        
        // High privilege users have many permissions (10+)
        return userRole.permissions.length >= 10;
      };

      if (isHighPrivilegeUser()) {
        setPermissions({
          canRead: true,
          canCreate: true,
          canEdit: true,
          canDelete: true
        });
        return;
      }

      const canRead = hasPermission('trips:read');
      const canCreate = hasPermission('trips:create');
      const canEdit = hasPermission('trips:update');
      const canDelete = hasPermission('trips:delete');

      setPermissions({ canRead, canCreate, canEdit, canDelete });
    };

    if (authUser) {
      checkPermissions();
    }
  }, [authUser, hasPermission, currentUser, roles]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refetch();
      await refreshPage(['trips']);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleAddMission = () => {
    console.log('🆕 Missions: Adding new mission');
    setIsNewMissionDialogOpen(true);
  };

  const handleEditMission = (mission: Trip) => {
    console.log('✏️ Missions: Editing mission:', mission.id);
    // Implementation for edit functionality
  };

  const handleDeleteMission = (mission: Trip) => {
    console.log('🗑️ Missions: Preparing to delete mission:', mission.id);
    setActionDialog({ isOpen: true, mission, action: 'delete' });
  };

  const handleTerminateMission = (mission: Trip) => {
    console.log('🔚 Missions: Preparing to terminate mission:', mission.id);
    setActionDialog({ isOpen: true, mission, action: 'terminate' });
  };

  const handleActionConfirm = async () => {
    if (!actionDialog.mission) return;
    
    try {
      // Implementation for delete/terminate actions
      console.log(`${actionDialog.action} mission:`, actionDialog.mission.id);
      
      // Close dialog and refresh
      setActionDialog({ isOpen: false, mission: null, action: null });
      await handleRefresh();
    } catch (error) {
      console.error('Error performing action:', error);
    }
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
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
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
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <MissionsHeader missionsCount={trips?.length || 0} />
        <div className="flex items-center space-x-2">
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <MissionsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        clearFilters={clearFilters}
        missions={trips || []}
      />

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

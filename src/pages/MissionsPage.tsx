
import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { useTrip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVans';
import { useRBAC } from '@/contexts/RBACContext';
import { useToast } from '@/hooks/use-toast';
import MissionsHeader from '@/components/missions/MissionsHeader';
import MissionsQuickStats from '@/components/missions/MissionsQuickStats';
import MissionList from '@/components/missions/MissionList';
import MissionDetailsDialog from '@/components/missions/MissionDetailsDialog';
import MissionActionDialog from '@/components/missions/MissionActionDialog';
import NewTripDialog from '@/components/NewTripDialog';
import { Trip } from '@/contexts/TripContext';

const MissionsPage = () => {
  const [isNewMissionDialogOpen, setIsNewMissionDialogOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Trip | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<'delete' | 'terminate' | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const { trips, isLoading, error, deleteTrip, endTrip } = useTrip();
  const { vans } = useVans();
  const { hasPermission } = useRBAC();
  const { toast } = useToast();

  const getVanDisplayName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    if (van) {
      return (van as any).reference_code || van.license_plate || van.model;
    }
    return vanId;
  };

  const handleNewMissionClick = () => {
    setIsNewMissionDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsNewMissionDialogOpen(false);
  };

  const handleViewDetails = (mission: Trip) => {
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (mission: Trip) => {
    setSelectedMission(mission);
    setCurrentAction('delete');
    setIsActionDialogOpen(true);
  };

  const handleTerminate = (mission: Trip) => {
    setSelectedMission(mission);
    setCurrentAction('terminate');
    setIsActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedMission || !currentAction) return;

    setIsActionLoading(true);
    try {
      if (currentAction === 'delete') {
        await deleteTrip(selectedMission.id);
        toast({
          title: 'Mission supprimée',
          description: 'La mission a été supprimée avec succès.',
        });
      } else if (currentAction === 'terminate') {
        // For terminate, we need to ask for end kilometers
        // For now, we'll use the current start km + 1 as a placeholder
        const endKm = (selectedMission.startKm || 0) + 1;
        await endTrip(selectedMission.id, endKm);
        toast({
          title: 'Mission terminée',
          description: 'La mission a été terminée avec succès.',
        });
      }
      
      setIsActionDialogOpen(false);
      setSelectedMission(null);
      setCurrentAction(null);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Impossible de ${currentAction === 'delete' ? 'supprimer' : 'terminer'} la mission.`,
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const canCreateMissions = hasPermission('missions:create');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Erreur</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section with integrated Mission Stats */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <MissionsHeader 
          onNewMissionClick={handleNewMissionClick}
          canCreateMissions={canCreateMissions}
        />

        {/* Quick Stats Cards */}
        <MissionsQuickStats trips={trips} />
      </div>

      {/* Mission List */}
      <MissionList 
        trips={trips}
        getVanDisplayName={getVanDisplayName}
        onNewMissionClick={handleNewMissionClick}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        onTerminate={handleTerminate}
      />

      {/* New Mission Dialog */}
      <NewTripDialog
        isOpen={isNewMissionDialogOpen}
        onClose={handleCloseDialog}
      />

      {/* Mission Details Dialog */}
      <MissionDetailsDialog
        mission={selectedMission}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedMission(null);
        }}
        getVanDisplayName={getVanDisplayName}
      />

      {/* Mission Action Dialog */}
      <MissionActionDialog
        mission={selectedMission}
        action={currentAction}
        isOpen={isActionDialogOpen}
        onClose={() => {
          setIsActionDialogOpen(false);
          setSelectedMission(null);
          setCurrentAction(null);
        }}
        onConfirm={handleConfirmAction}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default MissionsPage;

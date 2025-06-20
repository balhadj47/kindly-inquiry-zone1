
import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { useTrip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVans';
import { useRBAC } from '@/contexts/RBACContext';
import MissionsHeader from '@/components/missions/MissionsHeader';
import MissionsQuickStats from '@/components/missions/MissionsQuickStats';
import MissionList from '@/components/missions/MissionList';
import NewTripDialog from '@/components/NewTripDialog';

const MissionsPage = () => {
  const [isNewMissionDialogOpen, setIsNewMissionDialogOpen] = useState(false);
  const { trips, isLoading, error } = useTrip();
  const { vans } = useVans();
  const { hasPermission } = useRBAC();

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

  const canCreateMissions = hasPermission('missions:create');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
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
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Erreur</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section with integrated Mission Stats */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
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
      />

      {/* New Mission Dialog */}
      <NewTripDialog
        isOpen={isNewMissionDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default MissionsPage;

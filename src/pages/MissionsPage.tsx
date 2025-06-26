
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MissionsLayout from '@/components/missions/MissionsLayout';
import MissionsHeader from '@/components/missions/MissionsHeader';
import MissionsContainer from '@/components/missions/MissionsContainer';
import NewTripDialog from '@/components/NewTripDialog';
import { useTrip } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';

const MissionsPage = () => {
  console.log('🎯 MissionsPage: Component is rendering');
  console.log('🎯 MissionsPage: Current URL:', window.location.pathname);
  
  const { trips } = useTrip();
  const { hasPermission } = useRBAC();
  const [isNewMissionDialogOpen, setIsNewMissionDialogOpen] = useState(false);

  const handleNewMissionClick = () => {
    setIsNewMissionDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsNewMissionDialogOpen(false);
  };

  const canCreateMissions = hasPermission('missions:create');

  console.log('🎯 MissionsPage: Trips loaded:', trips?.length || 0);
  console.log('🎯 MissionsPage: Can create missions:', canCreateMissions);

  return (
    <MissionsLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Missions</h1>
          <p className="text-gray-500 mt-2">Gérez toutes vos missions</p>
        </div>
        {canCreateMissions && (
          <Button
            onClick={handleNewMissionClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Mission
          </Button>
        )}
      </div>

      <MissionsHeader 
        trips={trips}
        onNewMissionClick={handleNewMissionClick}
        canCreateMissions={canCreateMissions}
      />
      <MissionsContainer 
        isNewMissionDialogOpen={isNewMissionDialogOpen}
        setIsNewMissionDialogOpen={setIsNewMissionDialogOpen}
      />

      <NewTripDialog
        isOpen={isNewMissionDialogOpen}
        onClose={handleDialogClose}
      />
    </MissionsLayout>
  );
};

export default MissionsPage;

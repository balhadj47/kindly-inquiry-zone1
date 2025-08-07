
import React from 'react';
import MissionCard from './MissionCard';
import MissionTerminateDialog from './dialogs/MissionTerminateDialog';
import { useEndMission } from '@/hooks/missions/useEndMission';
import { Trip } from '@/contexts/TripContext';

interface MissionCardWithTerminationProps {
  mission: Trip;
  onMissionClick: (mission: Trip) => void;
  onDeleteClick: (mission: Trip) => void;
  getVanDisplayName: (vanId: string) => string;
  actionLoading: string | null;
}

const MissionCardWithTermination: React.FC<MissionCardWithTerminationProps> = (props) => {
  const {
    isTerminating,
    finalKm,
    selectedMission,
    isDialogOpen,
    openTerminateDialog,
    closeTerminateDialog,
    setFinalKm,
    handleTerminate,
  } = useEndMission();

  return (
    <>
      <MissionCard 
        {...props} 
        onTerminateClick={openTerminateDialog}
      />
      
      <MissionTerminateDialog
        isOpen={isDialogOpen}
        mission={selectedMission}
        finalKm={finalKm}
        isTerminating={isTerminating}
        onClose={closeTerminateDialog}
        onFinalKmChange={setFinalKm}
        onConfirm={handleTerminate}
      />
    </>
  );
};

export default MissionCardWithTermination;

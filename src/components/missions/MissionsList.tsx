
import React, { useState } from 'react';
import { Trip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVansOptimized';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { useToast } from '@/hooks/use-toast';
import MissionDetailsDialog from './MissionDetailsDialog';
import MissionCard from './MissionCard';
import MissionTerminateDialog from './MissionTerminateDialog';
import MissionsEmptyState from './MissionsEmptyState';

interface MissionsListProps {
  missions: Trip[];
  searchTerm: string;
  statusFilter: string;
  onEditMission: (mission: Trip) => void;
  onDeleteMission: (mission: Trip) => void;
  onTerminateMission: (mission: Trip) => void;
  canEdit: boolean;
  canDelete: boolean;
  actionLoading: string | null;
}

const MissionsList: React.FC<MissionsListProps> = ({
  missions,
  searchTerm,
  statusFilter,
  onEditMission,
  onDeleteMission,
  onTerminateMission,
  canEdit,
  canDelete,
  actionLoading,
}) => {
  const [selectedMission, setSelectedMission] = useState<Trip | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [showTerminatePrompt, setShowTerminatePrompt] = useState(false);
  const [terminateMission, setTerminateMission] = useState<Trip | null>(null);
  const [finalKm, setFinalKm] = useState('');
  const [isTerminating, setIsTerminating] = useState(false);
  const [deletingMissionId, setDeletingMissionId] = useState<number | null>(null);
  
  const { data: vans = [] } = useVans();
  const { updateTrip, deleteTrip } = useTripMutations();
  const { toast } = useToast();

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = !searchTerm || 
      mission.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.van.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && mission.status === 'active') ||
      (statusFilter === 'completed' && mission.status === 'completed') ||
      (statusFilter === 'terminated' && mission.status === 'terminated');
    
    return matchesSearch && matchesStatus;
  });

  const getVanDisplayName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId || v.reference_code === vanId);
    if (van) {
      return van.license_plate ? `${van.license_plate} (${van.model})` : van.model;
    }
    return vanId;
  };

  const handleMissionClick = (mission: Trip) => {
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedMission(null);
  };

  const handleTerminateClick = (mission: Trip) => {
    setTerminateMission(mission);
    setShowTerminatePrompt(true);
    setFinalKm('');
  };

  const handleTerminateSubmit = async () => {
    if (!terminateMission || !finalKm) {
      toast({
        title: 'Erreur',
        description: 'Veuillez saisir le kilométrage final',
        variant: 'destructive',
      });
      return;
    }

    const kmNumber = parseInt(finalKm, 10);
    if (isNaN(kmNumber) || kmNumber < 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez saisir un kilométrage valide',
        variant: 'destructive',
      });
      return;
    }

    if (terminateMission.start_km && kmNumber < terminateMission.start_km) {
      toast({
        title: 'Erreur',
        description: 'Le kilométrage final ne peut pas être inférieur au kilométrage initial',
        variant: 'destructive',
      });
      return;
    }

    setIsTerminating(true);
    try {
      await updateTrip.mutateAsync({
        id: terminateMission.id.toString(),
        end_km: kmNumber,
        status: 'completed'
      });
      
      toast({
        title: 'Succès',
        description: 'Mission terminée avec succès',
      });
      
      setShowTerminatePrompt(false);
      setTerminateMission(null);
      setFinalKm('');
      
      if (onTerminateMission) {
        onTerminateMission(terminateMission);
      }
    } catch (error) {
      console.error('Error terminating mission:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de terminer la mission',
        variant: 'destructive',
      });
    } finally {
      setIsTerminating(false);
    }
  };

  const handleCloseTerminatePrompt = () => {
    setShowTerminatePrompt(false);
    setTerminateMission(null);
    setFinalKm('');
  };

  const handleDeleteClick = async (mission: Trip) => {
    console.log('🗑️ MissionsList: Starting delete for mission:', mission.id);
    
    if (deletingMissionId === mission.id) {
      console.log('🗑️ MissionsList: Already deleting this mission');
      return;
    }

    setDeletingMissionId(mission.id);
    
    try {
      await deleteTrip.mutateAsync(mission.id.toString());
      console.log('🗑️ MissionsList: Mission deleted successfully:', mission.id);
      
      if (onDeleteMission) {
        onDeleteMission(mission);
      }
    } catch (error) {
      console.error('🗑️ MissionsList: Error deleting mission:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la mission',
        variant: 'destructive',
      });
    } finally {
      setDeletingMissionId(null);
    }
  };

  if (filteredMissions.length === 0) {
    return (
      <MissionsEmptyState 
        searchTerm={searchTerm} 
        statusFilter={statusFilter} 
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {filteredMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onMissionClick={handleMissionClick}
            onTerminateClick={handleTerminateClick}
            onDeleteClick={handleDeleteClick}
            getVanDisplayName={getVanDisplayName}
            canEdit={canEdit}
            canDelete={canDelete}
            actionLoading={deletingMissionId === mission.id ? 'loading' : null}
            isTerminating={isTerminating && terminateMission?.id === mission.id}
          />
        ))}
      </div>

      <MissionTerminateDialog
        isOpen={showTerminatePrompt}
        mission={terminateMission}
        finalKm={finalKm}
        isTerminating={isTerminating}
        onClose={handleCloseTerminatePrompt}
        onFinalKmChange={setFinalKm}
        onSubmit={handleTerminateSubmit}
      />

      {selectedMission && (
        <MissionDetailsDialog
          mission={selectedMission}
          isOpen={isDetailsDialogOpen}
          onClose={handleCloseDialog}
          getVanDisplayName={getVanDisplayName}
        />
      )}
    </>
  );
};

export default MissionsList;

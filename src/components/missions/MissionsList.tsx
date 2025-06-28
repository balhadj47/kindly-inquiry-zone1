import React, { useState } from 'react';
import { Bell, Eye, Circle, StopCircle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVansOptimized';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { useToast } from '@/hooks/use-toast';
import MissionDetailsDialog from './MissionDetailsDialog';

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
  
  const { data: vans = [] } = useVans();
  const { updateTrip } = useTripMutations();
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

  const handleMissionClick = (mission: Trip) => {
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedMission(null);
  };

  const getVanDisplayName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId || v.reference_code === vanId);
    if (van) {
      return van.license_plate ? `${van.license_plate} (${van.model})` : van.model;
    }
    return vanId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600';
      case 'completed':
        return 'text-blue-600';
      case 'terminated':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Terminée';
      case 'terminated':
        return 'Annulée';
      default:
        return 'Inconnu';
    }
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

  if (filteredMissions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-300 mb-6">
          <Bell className="h-20 w-20 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Aucune mission trouvée
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {searchTerm || statusFilter !== 'all' 
            ? 'Aucune mission ne correspond aux filtres actuels.'
            : 'Aucune mission n\'a été créée pour le moment.'
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {filteredMissions.map((mission) => (
          <div
            key={mission.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 cursor-pointer" onClick={() => handleMissionClick(mission)}>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {mission.company}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Circle className={`h-2.5 w-2.5 fill-current ${
                      mission.status === 'active' ? 'text-emerald-500' : 
                      mission.status === 'completed' ? 'text-blue-500' : 
                      mission.status === 'terminated' ? 'text-red-500' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm font-medium ${getStatusColor(mission.status || 'active')}`}>
                      {getStatusText(mission.status || 'active')}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{mission.branch}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMissionClick(mission)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                {canDelete && mission.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTerminateClick(mission)}
                    disabled={actionLoading === 'loading'}
                    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                  >
                    <StopCircle className="h-4 w-4" />
                  </Button>
                )}
                
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteMission(mission)}
                    disabled={actionLoading === 'loading'}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Chauffeur</p>
                <p className="text-gray-900 font-medium">{mission.driver}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Véhicule</p>
                <p className="text-gray-900 font-medium">{getVanDisplayName(mission.van)}</p>
              </div>
              
              {(mission.startKm || mission.start_km) && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Kilométrage</p>
                  <p className="text-gray-900 font-medium">
                    {mission.startKm || mission.start_km}
                    {(mission.endKm || mission.end_km) && (
                      <span className="text-gray-500"> → {mission.endKm || mission.end_km}</span>
                    )}
                  </p>
                </div>
              )}
              
              {mission.destination && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Destination</p>
                  <p className="text-gray-900 font-medium truncate">{mission.destination}</p>
                </div>
              )}
            </div>

            {mission.notes && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Notes:</span> {mission.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Terminate Mission Prompt */}
      {showTerminatePrompt && terminateMission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Terminer la Mission</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseTerminatePrompt}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Mission: <span className="font-medium">{terminateMission.company}</span>
                </p>
                {terminateMission.start_km && (
                  <p className="text-sm text-gray-600 mb-4">
                    Kilométrage initial: {terminateMission.start_km} km
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="finalKm" className="text-gray-700 font-medium">
                  Kilométrage Final du Véhicule
                </Label>
                <Input
                  id="finalKm"
                  type="number"
                  placeholder="Entrez le kilométrage final"
                  value={finalKm}
                  onChange={(e) => setFinalKm(e.target.value)}
                  className="mt-2"
                  min={terminateMission.start_km || 0}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleTerminateSubmit}
                  disabled={!finalKm || isTerminating}
                  className="flex-1"
                >
                  {isTerminating ? 'Finalisation...' : 'Confirmer'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloseTerminatePrompt}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MissionDetailsDialog
        mission={selectedMission}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDialog}
        getVanDisplayName={getVanDisplayName}
      />
    </>
  );
};

export default MissionsList;

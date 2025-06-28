
import React, { useState } from 'react';
import { Bell, Eye } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import MissionCard from './MissionCard';
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
    return vanId; // Simple implementation, can be enhanced later
  };

  if (filteredMissions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Bell className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune mission trouvée
        </h3>
        <p className="text-gray-500">
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
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y divide-gray-200">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleMissionClick(mission)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {mission.company}
                      </h3>
                      <p className="text-sm text-gray-600">{mission.branch}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {mission.driver}
                      </p>
                      <p className="text-sm text-gray-600">
                        {mission.van}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        mission.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : mission.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {mission.status === 'active' ? 'Active' : 
                         mission.status === 'completed' ? 'Terminée' : 'Annulée'}
                      </span>
                      
                      {(mission.startKm || mission.start_km) && (
                        <span className="text-sm text-gray-600">
                          Km: {mission.startKm || mission.start_km}
                          {(mission.endKm || mission.end_km) && 
                            ` - ${mission.endKm || mission.end_km}`
                          }
                        </span>
                      )}
                    </div>
                    
                    <Eye className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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


import React, { useState } from 'react';
import { Bell, Eye } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleMissionClick(mission)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {mission.company}
                      </h3>
                      <p className="text-sm text-gray-600">{mission.branch}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(mission.status || 'active')}`}>
                        {getStatusText(mission.status || 'active')}
                      </span>
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 w-20">Chauffeur:</span>
                        <span className="text-blue-600 font-medium">{mission.driver}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 w-20">Véhicule:</span>
                        <span className="text-purple-600 font-medium">{mission.van}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {(mission.startKm || mission.start_km) && (
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-24">Km début:</span>
                          <span className="text-green-600 font-medium">{mission.startKm || mission.start_km}</span>
                          {(mission.endKm || mission.end_km) && (
                            <>
                              <span className="mx-2 text-gray-400">→</span>
                              <span className="font-medium text-gray-700">Km fin:</span>
                              <span className="text-red-600 font-medium ml-1">{mission.endKm || mission.end_km}</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      {mission.destination && (
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-24">Destination:</span>
                          <span className="text-orange-600 font-medium">{mission.destination}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {mission.notes && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <span className="text-sm font-medium text-yellow-800">Notes: </span>
                      <span className="text-sm text-yellow-700">{mission.notes}</span>
                    </div>
                  )}
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

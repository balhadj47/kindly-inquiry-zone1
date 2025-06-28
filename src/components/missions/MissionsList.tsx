
import React from 'react';
import { Bell } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import MissionCard from './MissionCard';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredMissions.map(mission => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onEdit={onEditMission}
          onDelete={onDeleteMission}
          onTerminate={onTerminateMission}
          canEdit={canEdit}
          canDelete={canDelete}
          actionLoading={actionLoading}
        />
      ))}
    </div>
  );
};

export default MissionsList;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';

interface MissionsHeaderProps {
  trips: Trip[];
  onNewMissionClick?: () => void;
  canCreateMissions: boolean;
}

const MissionsHeader: React.FC<MissionsHeaderProps> = ({
  trips,
  onNewMissionClick,
  canCreateMissions,
}) => {
  const activeMissions = trips?.filter(trip => trip.status === 'active') || [];
  const completedMissions = trips?.filter(trip => trip.status === 'completed') || [];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Missions</h1>
        <div className="flex items-center space-x-6 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {activeMissions.length} active{activeMissions.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {completedMissions.length} terminée{completedMissions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      
      {canCreateMissions && onNewMissionClick && (
        <Button onClick={onNewMissionClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Mission
        </Button>
      )}
    </div>
  );
};

export default MissionsHeader;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Truck } from 'lucide-react';

interface MissionsHeaderProps {
  onNewMissionClick: () => void;
  canCreateMissions: boolean;
}

const MissionsHeader: React.FC<MissionsHeaderProps> = ({ 
  onNewMissionClick, 
  canCreateMissions 
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          <Truck className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1 text-gray-900">Gestion des Missions</h1>
          <p className="text-gray-600">Gérez vos missions et suivez vos activités en temps réel</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button
          onClick={onNewMissionClick}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
          disabled={!canCreateMissions}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Mission
        </Button>
      </div>
    </div>
  );
};

export default MissionsHeader;

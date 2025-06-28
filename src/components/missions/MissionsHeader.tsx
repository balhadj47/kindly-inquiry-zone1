
import React from 'react';
import { Bell } from 'lucide-react';

interface MissionsHeaderProps {
  missionsCount: number;
}

const MissionsHeader: React.FC<MissionsHeaderProps> = ({ 
  missionsCount
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Bell className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Missions</h1>
          <p className="text-gray-600 mt-1">
            {missionsCount} mission{missionsCount !== 1 ? 's' : ''} active{missionsCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionsHeader;

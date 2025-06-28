
import React from 'react';
import { Circle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trip } from '@/contexts/TripContext';

interface MissionCardProps {
  mission: Trip;
  onMissionClick: (mission: Trip) => void;
  onTerminateClick: (mission: Trip) => void;
  onDeleteClick: (mission: Trip) => void;
  getVanDisplayName: (vanId: string) => string;
  canEdit: boolean;
  canDelete: boolean;
  actionLoading: string | null;
  isTerminating: boolean;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onMissionClick,
  onTerminateClick,
  onDeleteClick,
  getVanDisplayName,
  canEdit,
  canDelete,
  actionLoading,
  isTerminating,
}) => {
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

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 cursor-pointer" onClick={() => onMissionClick(mission)}>
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
          {canDelete && mission.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTerminateClick(mission)}
              disabled={actionLoading === 'loading' || isTerminating}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              Terminer
            </Button>
          )}
          
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteClick(mission)}
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
  );
};

export default MissionCard;

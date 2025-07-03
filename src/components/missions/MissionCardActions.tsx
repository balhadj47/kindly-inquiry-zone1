
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, StopCircle } from 'lucide-react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

interface Mission {
  id: number;
  company: string;
  branch: string;
  van: string;
  driver: string;
  status?: string;
}

interface MissionCardActionsProps {
  mission: Mission;
  onEdit: (mission: Mission) => void;
  onDelete: (mission: Mission) => void;
  onView: (mission: Mission) => void;
  onTerminate: (mission: Mission) => void;
}

const MissionCardActions: React.FC<MissionCardActionsProps> = ({
  mission,
  onEdit,
  onDelete,
  onView,
  onTerminate
}) => {
  const { canUpdateTrips, canDeleteTrips } = usePermissionCheck();

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onView(mission)}
        style={{
          backgroundColor: 'white',
          borderColor: '#d1d5db',
          color: '#4b5563'
        }}
        className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {canUpdateTrips && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(mission)}
            style={{
              backgroundColor: 'white',
              borderColor: '#93c5fd',
              color: '#2563eb'
            }}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-400"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          {mission.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTerminate(mission)}
              style={{
                backgroundColor: 'white',
                borderColor: '#fdba74',
                color: '#ea580c'
              }}
              className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-800 hover:border-orange-400"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
      
      {canDeleteTrips && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(mission)}
          style={{
            backgroundColor: 'white',
            borderColor: '#fca5a5',
            color: '#dc2626'
          }}
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MissionCardActions;

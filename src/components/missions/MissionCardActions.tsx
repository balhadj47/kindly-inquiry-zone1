
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
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onView(mission)}
        className="h-8 w-8 p-0 !bg-white !border-gray-300 !text-gray-600 hover:!bg-gray-50 hover:!text-gray-800 hover:!border-gray-400"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {canUpdateTrips && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(mission)}
            className="h-8 w-8 p-0 !bg-white !border-gray-300 !text-gray-600 hover:!bg-gray-50 hover:!text-gray-800 hover:!border-gray-400"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          {mission.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTerminate(mission)}
              className="h-8 w-8 p-0 !bg-white !border-gray-300 !text-orange-600 hover:!bg-orange-50 hover:!text-orange-700 hover:!border-orange-300"
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
          className="h-8 w-8 p-0 !bg-white !border-gray-300 !text-red-500 hover:!bg-red-50 hover:!text-red-600 hover:!border-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MissionCardActions;


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
    <div className="flex items-center gap-2">
      <Button
        onClick={() => onView(mission)}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 bg-blue-500 text-white hover:bg-blue-600"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {canUpdateTrips && (
        <>
          <Button
            onClick={() => onEdit(mission)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-blue-500 text-white hover:bg-blue-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          {mission.status === 'active' && (
            <Button
              onClick={() => onTerminate(mission)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-orange-500 text-white hover:bg-orange-600"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
      
      {canDeleteTrips && (
        <Button
          onClick={() => onDelete(mission)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MissionCardActions;

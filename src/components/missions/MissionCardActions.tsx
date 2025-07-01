
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
        variant="ghost"
        size="sm"
        onClick={() => onView(mission)}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {canUpdateTrips && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(mission)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          {mission.status === 'active' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTerminate(mission)}
              className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
      
      {canDeleteTrips && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(mission)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MissionCardActions;

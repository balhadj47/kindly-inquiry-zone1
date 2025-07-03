
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, StopCircle } from 'lucide-react';
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
  onDelete,
  onTerminate
}) => {
  const { canUpdateTrips, canDeleteTrips } = usePermissionCheck();

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {canUpdateTrips && mission.status === 'active' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTerminate(mission)}
          className="h-8 w-8 p-0 bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200"
        >
          <StopCircle className="h-4 w-4" />
        </Button>
      )}
      
      {canDeleteTrips && mission.status !== 'completed' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(mission)}
          className="h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MissionCardActions;

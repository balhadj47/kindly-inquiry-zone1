
import React from 'react';
import { Trip } from '@/contexts/TripContext';
import { useUsers } from '@/hooks/users';
import { User } from '@/hooks/users/types';
import MissionCardActions from './MissionCardActions';
import MissionCardHeader from './components/MissionCardHeader';
import MissionCardAvatar from './components/MissionCardAvatar';
import MissionCardMetadata from './components/MissionCardMetadata';
import MissionCardNotes from './components/MissionCardNotes';
import { useVans } from '@/hooks/useVansOptimized';

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
  const { data: usersData } = useUsers();
  const { data: vans = [] } = useVans();
  const users: User[] = usersData?.users || [];

  const actions = (canEdit || canDelete) && (
    <MissionCardActions
      mission={mission}
      onEdit={() => onMissionClick(mission)}
      onDelete={() => onDeleteClick(mission)}
      onView={() => onMissionClick(mission)}
      onTerminate={() => onTerminateClick(mission)}
    />
  );

  return (
    <div 
      onClick={() => onMissionClick(mission)}
      className="group hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 rounded-lg p-3 cursor-pointer bg-white h-40 flex flex-col"
    >
      <MissionCardHeader mission={mission} vans={vans} />
      
      <div className="flex items-center justify-between flex-1 min-h-0">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <MissionCardAvatar mission={mission} users={users} />
          <div className="flex-1 min-w-0">
            <MissionCardMetadata mission={mission} users={users} getVanDisplayName={getVanDisplayName} />
          </div>
        </div>
        
        {actions && (
          <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {actions}
          </div>
        )}
      </div>
      
      <MissionCardNotes mission={mission} />
    </div>
  );
};

export default MissionCard;

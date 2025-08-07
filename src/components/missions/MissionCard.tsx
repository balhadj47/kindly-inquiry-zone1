
import React from 'react';
import { Trip } from '@/contexts/TripContext';
import { useUsers } from '@/hooks/users';
import { User } from '@/hooks/users/types';
import { EntityCard } from '@/components/ui/entity-card';
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
      className="group hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300 rounded-lg p-4 cursor-pointer bg-white"
    >
      <MissionCardHeader mission={mission} vans={vans} />
      <MissionCardAvatar mission={mission} users={users} />
      <MissionCardMetadata mission={mission} users={users} getVanDisplayName={getVanDisplayName} />
      <MissionCardNotes mission={mission} />
      {actions && (
        <div className="mt-4 flex justify-end">
          {actions}
        </div>
      )}
    </div>
  );
};

export default MissionCard;

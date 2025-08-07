
import React from 'react';
import { Trip } from '@/contexts/TripContext';
import { useUsers } from '@/hooks/users';
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
  const users = usersData?.users || [];

  const headerData = MissionCardHeader({ mission, vans });
  const metadata = MissionCardMetadata({ mission, users, getVanDisplayName });

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
    <EntityCard
      title={headerData.title}
      status={headerData.status}
      metadata={metadata}
      actions={actions}
      onClick={() => onMissionClick(mission)}
      className="group hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
    >
      <MissionCardAvatar mission={mission} users={users} />
      <MissionCardNotes mission={mission} />
    </EntityCard>
  );
};

export default MissionCard;

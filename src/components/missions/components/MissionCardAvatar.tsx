
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trip } from '@/contexts/TripContext';
import { User } from '@/types/rbac';
import { getUserInitials } from '@/utils/userDisplayUtils';
import { getDriverName } from '../utils/missionCardUtils';

interface MissionCardAvatarProps {
  mission: Trip;
  users: User[];
}

const MissionCardAvatar: React.FC<MissionCardAvatarProps> = ({
  mission,
  users
}) => {
  const driverName = getDriverName(mission, users);

  return (
    <div className="flex items-center space-x-3 mb-4">
      <Avatar className="h-12 w-12 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200">
        <AvatarImage 
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${driverName}`}
          alt={driverName}
        />
        <AvatarFallback className="bg-gray-600 text-white font-medium">
          {getUserInitials(driverName)}
        </AvatarFallback>
      </Avatar>
      <div className="text-xs text-gray-500">
        Mission: {mission.status === 'active' ? 'En cours' : 'Terminée'}
      </div>
    </div>
  );
};

export default MissionCardAvatar;

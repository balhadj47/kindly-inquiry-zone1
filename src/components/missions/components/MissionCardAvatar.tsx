
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trip } from '@/contexts/TripContext';
import { User } from '@/hooks/users/types';
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
    <Avatar className="h-8 w-8 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200 flex-shrink-0">
      <AvatarImage 
        src={`https://api.dicebear.com/7.x/initials/svg?seed=${driverName}`}
        alt={driverName}
      />
      <AvatarFallback className="bg-gray-600 text-white font-medium text-xs">
        {getUserInitials(driverName)}
      </AvatarFallback>
    </Avatar>
  );
};

export default MissionCardAvatar;

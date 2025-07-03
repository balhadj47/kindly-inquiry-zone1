
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmployeeAvatarDisplayProps {
  profileImage: string;
  userName: string;
}

const EmployeeAvatarDisplay: React.FC<EmployeeAvatarDisplayProps> = ({
  profileImage,
  userName,
}) => {
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage 
          src={profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`}
          alt={userName}
          key={profileImage || 'fallback'} // Force re-render when image changes
        />
        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
          {userName ? getUserInitials(userName) : 'EMP'}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default EmployeeAvatarDisplay;

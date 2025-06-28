
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/rbac';
import { getStatusColor, getUserInitials } from '@/utils/userDisplayUtils';
import { useRoleData } from '@/hooks/useRoleData';

interface UserCardHeaderProps {
  user: User;
}

const UserCardHeader: React.FC<UserCardHeaderProps> = ({ user }) => {
  const { roleName, roleColor } = useRoleData(user.role_id);

  return (
    <CardHeader className="pb-4 space-y-0">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar className="h-14 w-14 ring-2 ring-muted">
            <AvatarImage 
              src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt={user.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {user.name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge 
                variant="outline" 
                className="text-xs font-medium"
                style={{ color: roleColor, borderColor: roleColor }}
              >
                {roleName}
              </Badge>
              <Badge 
                variant="outline"
                className={`text-xs font-medium ${getStatusColor(user.status)}`}
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

export default UserCardHeader;

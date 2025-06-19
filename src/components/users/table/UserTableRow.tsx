
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail } from 'lucide-react';
import { User } from '@/types/rbac';
import { getStatusColor, getUserInitials } from '@/utils/userDisplayUtils';
import { getRoleNameFromId, getRoleColorFromId } from '@/utils/roleUtils';
import UserActions from './UserActions';

interface UserTableRowProps {
  user: User;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = React.memo(({
  user,
  onEditUser,
  onDeleteUser,
  onChangePassword,
}) => {
  const avatarSrc = React.useMemo(() => 
    user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
    [user.profileImage, user.name]
  );

  const userInitials = React.useMemo(() => 
    getUserInitials(user.name),
    [user.name]
  );

  const roleName = React.useMemo(() => 
    getRoleNameFromId(user.role_id),
    [user.role_id]
  );

  const roleColor = React.useMemo(() => 
    getRoleColorFromId(user.role_id),
    [user.role_id]
  );

  const statusColorClasses = React.useMemo(() => 
    getStatusColor(user.status),
    [user.status]
  );

  const lastTripDate = React.useMemo(() => 
    user.lastTrip ? new Date(user.lastTrip).toLocaleDateString('fr-FR') : null,
    [user.lastTrip]
  );

  const createdAtDate = React.useMemo(() => 
    new Date(user.createdAt).toLocaleDateString('fr-FR'),
    [user.createdAt]
  );

  return (
    <TableRow key={user.id} className="hover:bg-muted/50">
      <TableCell>
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={avatarSrc}
            alt={user.name}
          />
          <AvatarFallback className="text-xs">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      
      <TableCell>
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </TableCell>
      
      <TableCell>
        <Badge 
          variant="outline" 
          className="text-xs"
          style={{ color: roleColor, borderColor: roleColor }}
        >
          {roleName}
        </Badge>
      </TableCell>
      
      <TableCell>
        <Badge 
          variant="outline"
          className={`text-xs ${statusColorClasses}`}
        >
          {user.status}
        </Badge>
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
            {user.phone}
          </div>
          <div className="flex items-center text-sm">
            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="truncate max-w-32">{user.email}</span>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="text-sm">
          <div className="font-medium">{user.totalTrips || 0}</div>
          {lastTripDate && (
            <div className="text-muted-foreground text-xs">
              Dernier: {lastTripDate}
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell className="text-sm text-muted-foreground">
        {createdAtDate}
      </TableCell>
      
      <TableCell>
        <UserActions
          user={user}
          onEdit={onEditUser}
          onChangePassword={onChangePassword}
          onDelete={onDeleteUser}
        />
      </TableCell>
    </TableRow>
  );
});

UserTableRow.displayName = 'UserTableRow';

export default UserTableRow;

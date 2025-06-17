
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail } from 'lucide-react';
import { User } from '@/types/rbac';
import { getStatusColor, getRoleColor, getUserInitials } from '@/utils/userDisplayUtils';
import UserActions from './UserActions';

interface UserTableRowProps {
  user: User;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onEditUser,
  onDeleteUser,
  onChangePassword,
}) => {
  return (
    <TableRow key={user.id} className="hover:bg-muted/50">
      <TableCell>
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
          />
          <AvatarFallback className="text-xs">
            {getUserInitials(user.name)}
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
          className={`text-xs ${getRoleColor(user.systemGroup)}`}
        >
          {user.systemGroup}
        </Badge>
      </TableCell>
      
      <TableCell>
        <Badge 
          variant="outline"
          className={`text-xs ${getStatusColor(user.status)}`}
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
          {user.lastTrip && (
            <div className="text-muted-foreground text-xs">
              Dernier: {new Date(user.lastTrip).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell className="text-sm text-muted-foreground">
        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
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
};

export default UserTableRow;


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail, Calendar, MapPin, CreditCard, User as UserIcon, Key, Trash } from 'lucide-react';
import { User } from '@/types/rbac';
import { EntityCard } from '@/components/ui/entity-card';
import { Button } from '@/components/ui/button';
import { useRoleData } from '@/hooks/useRoleData';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onChangePassword?: (user: User) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onChangePassword,
  canEdit = false,
  canDelete = false
}) => {
  const { roleName, roleColor } = useRoleData(user.role_id);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { variant: 'default' as const, color: 'green' };
      case 'Inactive':
        return { variant: 'secondary' as const, color: 'gray' };
      case 'Suspended':
        return { variant: 'destructive' as const, color: 'red' };
      case 'Récupération':
        return { variant: 'outline' as const, color: 'blue' };
      case 'Congé':
        return { variant: 'outline' as const, color: 'yellow' };
      case 'Congé maladie':
        return { variant: 'outline' as const, color: 'orange' };
      default:
        return { variant: 'secondary' as const, color: 'gray' };
    }
  };

  const statusConfig = getStatusColor(user.status);

  const metadata = [
    {
      label: 'Email',
      value: user.email,
      icon: <Mail className="h-4 w-4" />
    },
    user.phone && {
      label: 'Téléphone',
      value: user.phone,
      icon: <Phone className="h-4 w-4" />
    },
    user.badgeNumber && {
      label: 'Badge',
      value: user.badgeNumber,
      icon: <CreditCard className="h-4 w-4" />
    },
    user.address && {
      label: 'Adresse',
      value: user.address,
      icon: <MapPin className="h-4 w-4" />
    },
    {
      label: 'Rôle',
      value: roleName,
      icon: <UserIcon className="h-4 w-4" />
    }
  ].filter(Boolean);

  const actions = (
    <div className="flex items-center gap-2">
      {canEdit && onEdit && (
        <Button
          onClick={() => onEdit(user)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-blue-500 text-white hover:bg-blue-600"
        >
          <UserIcon className="h-4 w-4" />
        </Button>
      )}
      {canEdit && onChangePassword && (
        <Button
          onClick={() => onChangePassword(user)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-green-500 text-white hover:bg-green-600"
        >
          <Key className="h-4 w-4" />
        </Button>
      )}
      {canDelete && onDelete && (
        <Button
          onClick={() => onDelete(user)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600"
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <EntityCard
      title={user.name}
      status={{
        label: user.status,
        variant: statusConfig.variant,
        color: statusConfig.color
      }}
      metadata={metadata}
      actions={actions}
      className="group hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-12 w-12 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200">
          <AvatarImage 
            src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
          />
          <AvatarFallback className="bg-gray-600 text-white font-medium">
            {getUserInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="text-xs text-gray-500">
          Créé le: {new Date(user.createdAt).toLocaleDateString('fr-FR')}
        </div>
      </div>

      <div className="mb-4">
        <Badge 
          variant="outline" 
          className="text-xs font-medium"
          style={{ color: roleColor, borderColor: roleColor }}
        >
          {roleName}
        </Badge>
      </div>
    </EntityCard>
  );
};

export default UserCard;


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, User, Calendar, Clock, Mail, Phone } from 'lucide-react';
import { useRoleData } from '@/hooks/useRoleData';
import { EntityCard } from '@/components/ui/entity-card';
import { Button } from '@/components/ui/button';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  phone: string | null;
  role: string;
  user_metadata: any;
}

interface AuthUserCardProps {
  user: AuthUser;
  onEdit: (user: AuthUser) => void;
  onDelete: (user: AuthUser) => void;
  canEdit: boolean;
  canDelete: boolean;
  actionLoading?: string | null;
}

const AuthUserCard: React.FC<AuthUserCardProps> = ({
  user,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  actionLoading,
}) => {
  const userRoleId = user?.user_metadata?.role_id || 2;
  const { roleName, roleColor } = useRoleData(userRoleId);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Jamais connecté';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = () => {
    if (user.email_confirmed_at) {
      return { variant: 'default' as const, color: 'green' };
    }
    return { variant: 'destructive' as const, color: 'red' };
  };

  const statusConfig = getStatusConfig();

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
    {
      label: 'Rôle',
      value: roleName || 'Rôle inconnu',
      icon: <User className="h-4 w-4" />
    },
    {
      label: 'Créé le',
      value: formatDate(user.created_at),
      icon: <Calendar className="h-4 w-4" />
    },
    {
      label: 'Dernière connexion',
      value: formatDateTime(user.last_sign_in_at),
      icon: <Clock className="h-4 w-4" />
    }
  ].filter(Boolean);

  const actions = (
    <div className="flex items-center gap-2">
      {canEdit && (
        <Button
          onClick={() => onEdit(user)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-blue-500 text-white hover:bg-blue-600"
          disabled={actionLoading === 'loading'}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {canDelete && (
        <Button
          onClick={() => onDelete(user)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600"
          disabled={actionLoading === 'loading'}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <EntityCard
      title={user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur'}
      status={{
        label: user.email_confirmed_at ? 'Confirmé' : 'Non confirmé',
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
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.user_metadata?.name || user.email}`}
            alt={user.user_metadata?.name || user.email}
          />
          <AvatarFallback className="bg-gray-600 text-white font-medium">
            {getUserInitials(user.user_metadata?.name || user.email?.split('@')[0] || 'U')}
          </AvatarFallback>
        </Avatar>
        <div className="text-xs text-gray-500">
          Compte auth: {user.email_confirmed_at ? 'Vérifié' : 'En attente'}
        </div>
      </div>

      <div className="mb-4">
        <Badge 
          variant="outline" 
          className="text-xs font-medium"
          style={{ color: roleColor, borderColor: roleColor }}
        >
          {roleName || 'Rôle inconnu'}
        </Badge>
      </div>
    </EntityCard>
  );
};

export default AuthUserCard;

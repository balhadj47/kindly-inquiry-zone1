
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, Calendar, Clock, Mail, Phone } from 'lucide-react';
import { useRoleData } from '@/hooks/useRoleData';

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
  // Safely extract role_id with fallback
  const userRoleId = user?.user_metadata?.role_id || 2;
  const { roleName, roleColor } = useRoleData(userRoleId);

  // Safe date formatters with error handling
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non disponible';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Jamais connecté';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.warn('Error formatting datetime:', error);
      return 'Date invalide';
    }
  };

  const getRoleBadge = () => {
    if (!roleName) {
      return <Badge variant="secondary">Rôle inconnu</Badge>;
    }
    
    return (
      <Badge 
        className="text-white"
        style={{ backgroundColor: roleColor || '#6b7280' }}
      >
        {roleName}
      </Badge>
    );
  };

  const getStatusBadge = () => {
    if (!user?.email_confirmed_at) {
      return <Badge variant="destructive">Non confirmé</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
  };

  // Handle missing user data gracefully
  if (!user) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <p className="text-gray-500">Données utilisateur non disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur'}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {getRoleBadge()}
                {getStatusBadge()}
              </div>
            </div>
          </div>
          {(canEdit || canDelete) && actionLoading !== 'loading' && (
            <div className="flex space-x-1">
              {canEdit && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(user)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {canDelete && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(user)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{user.email || 'Email non disponible'}</span>
        </div>
        
        {user.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{user.phone}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Créé le {formatDate(user.created_at)}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Dernière connexion: {formatDateTime(user.last_sign_in_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthUserCard;

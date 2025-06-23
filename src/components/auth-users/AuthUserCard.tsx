
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Clock, Shield, Edit, Trash2 } from 'lucide-react';

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
  isLoading: boolean;
}

const AuthUserCard: React.FC<AuthUserCardProps> = ({
  user,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  isLoading,
}) => {
  const getStatusBadge = () => {
    if (user.email_confirmed_at) {
      return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
  };

  const getRoleBadge = () => {
    const roleId = user.user_metadata?.role_id || 2;
    if (roleId === 1) {
      return <Badge className="bg-red-100 text-red-800">Administrateur</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Superviseur</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <span className="truncate">{user.email}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            {getRoleBadge()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div>
            <span className="font-medium">Nom:</span> {user.user_metadata?.name || 'Non défini'}
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Créé:</span> 
            <span>{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Dernière connexion:</span> 
            <span>
              {user.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleDateString('fr-FR')
                : 'Jamais'
              }
            </span>
          </div>
          
          {user.phone && (
            <div>
              <span className="font-medium">Téléphone:</span> {user.phone}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="text-xs text-gray-500 truncate">
            ID: {user.id.substring(0, 8)}...
          </div>
          
          <div className="flex items-center space-x-2">
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(user)}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(user)}
                disabled={isLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthUserCard;

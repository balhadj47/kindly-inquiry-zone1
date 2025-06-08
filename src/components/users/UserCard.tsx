
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Trash2 } from 'lucide-react';
import { User } from '@/types/rbac';

interface UserCardProps {
  user: User;
  userGroup?: any;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  getStatusColor: (status: string) => string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  userGroup,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  getStatusColor,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <p className="text-sm text-gray-600">{user.role}</p>
            {user.licenseNumber && (
              <p className="text-xs text-gray-500">{user.licenseNumber}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={getStatusColor(user.status)}>
              {user.status}
            </Badge>
            {userGroup && (
              <Badge className={userGroup.color}>
                {userGroup.name}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{user.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{user.email}</span>
          </div>
        </div>
        
        {(user.role === 'Chauffeur Armé' || user.role === 'Chauffeur Sans Armé') && user.totalTrips && (
          <div className="text-sm text-gray-600">
            <p><span className="font-medium">Total des Voyages:</span> {user.totalTrips}</p>
            <p><span className="font-medium">Dernier Voyage:</span> {user.lastTrip}</p>
          </div>
        )}
        
        <div className="flex space-x-2 pt-2">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(user)}
              className="flex-1"
            >
              Modifier
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Voir l'Historique
          </Button>
          {canDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(user)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;

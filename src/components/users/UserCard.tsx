
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail, Key, User as UserIcon, MoreVertical, MapPin, Calendar, Truck, Clock } from 'lucide-react';
import { User } from '@/types/rbac';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onChangePassword,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'récupération':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'congé':
      case 'congé maladie':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    if (role.includes('Administrator')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (role.includes('Chef')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (role.includes('Chauffeur')) return 'bg-green-50 text-green-700 border-green-200';
    if (role.includes('APS')) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isDriver = user.role === 'Chauffeur Armé' || user.role === 'Chauffeur Sans Armé';

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border hover:border-primary/20 bg-card">
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
                  className={`text-xs font-medium ${getRoleColor(user.role)}`}
                >
                  {user.role}
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <UserIcon className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangePassword(user)}>
                <Key className="h-4 w-4 mr-2" />
                Changer mot de passe
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer l'utilisateur "{user.name}" ? 
                      Cette action ne peut pas être annulée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(user)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Contact
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{user.phone}</span>
            </div>
          </div>
        </div>

        {/* License Information */}
        {user.licenseNumber && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Licence
            </h4>
            <div className="flex items-center space-x-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                {user.licenseNumber}
              </span>
            </div>
          </div>
        )}

        {/* Driver Statistics */}
        {isDriver && user.totalTrips && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Statistiques
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Voyages</span>
                </div>
                <span className="text-lg font-bold text-primary">{user.totalTrips}</span>
              </div>
              {user.lastTrip && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Dernier Voyage</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{user.lastTrip}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Compte
          </h4>
          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">
              Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
            className="flex-1 justify-center"
          >
            <UserIcon className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangePassword(user)}
            className="flex-1 justify-center"
          >
            <Key className="h-4 w-4 mr-2" />
            Mot de passe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;

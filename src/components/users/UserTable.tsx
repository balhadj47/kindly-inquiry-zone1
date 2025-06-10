
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { MoreVertical, User as UserIcon, Key, Phone, Mail } from 'lucide-react';
import { User } from '@/types/rbac';

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEditUser,
  onDeleteUser,
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

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Voyages</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
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
                  className={`text-xs ${getRoleColor(user.role)}`}
                >
                  {user.role}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditUser(user)}>
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
                            onClick={() => onDeleteUser(user)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;

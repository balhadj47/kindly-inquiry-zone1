
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User as UserIcon } from 'lucide-react';
import { User } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';
import UserCard from './UserCard';

interface UserGridProps {
  users: User[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserGrid: React.FC<UserGridProps> = ({
  users,
  hasActiveFilters,
  clearFilters,
  onEditUser,
  onDeleteUser,
}) => {
  const { getUserGroup, hasPermission, currentUser } = useRBAC();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Récupération': return 'bg-yellow-100 text-yellow-800';
      case 'Congé': return 'bg-blue-100 text-blue-800';
      case 'Congé maladie': return 'bg-red-100 text-red-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
          <p className="text-gray-500">
            {hasActiveFilters 
              ? 'Essayez d\'ajuster vos filtres ou termes de recherche.' 
              : 'Essayez d\'ajuster vos termes de recherche ou ajoutez un nouvel utilisateur.'
            }
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Effacer tous les filtres
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => {
        const userGroup = getUserGroup(user);
        const canDeleteThisUser = hasPermission('users.delete') && currentUser?.id !== user.id;
        
        return (
          <UserCard
            key={user.id}
            user={user}
            userGroup={userGroup}
            canEdit={hasPermission('users.edit')}
            canDelete={canDeleteThisUser}
            onEdit={onEditUser}
            onDelete={onDeleteUser}
            getStatusColor={getStatusColor}
          />
        );
      })}
    </div>
  );
};

export default UserGrid;

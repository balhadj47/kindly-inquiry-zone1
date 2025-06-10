
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User as UserIcon } from 'lucide-react';
import { User } from '@/types/rbac';
import UserCard from './UserCard';
import UserPagination from './UserPagination';

interface UserGridProps {
  users: User[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onChangePassword: (user: User) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const UserGrid: React.FC<UserGridProps> = ({
  users,
  hasActiveFilters,
  clearFilters,
  onEditUser,
  onDeleteUser,
  onChangePassword,
  currentPage,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
          </h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters 
              ? 'Aucun utilisateur ne correspond aux filtres actuels.' 
              : 'Créez votre premier utilisateur pour commencer.'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Effacer les filtres
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEditUser}
            onDelete={onDeleteUser}
            onChangePassword={onChangePassword}
          />
        ))}
      </div>

      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default UserGrid;

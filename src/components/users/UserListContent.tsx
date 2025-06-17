
import React from 'react';
import { User } from '@/types/rbac';
import UserTable from './UserTable';
import UserGrid from './UserGrid';
import UserPagination from './UserPagination';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserListContentProps {
  view: 'grid' | 'table';
  filteredUsers: User[];
  paginatedUsers: User[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onChangePassword: (user: User) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

const UserListContent: React.FC<UserListContentProps> = ({
  view,
  filteredUsers,
  paginatedUsers,
  hasActiveFilters,
  clearFilters,
  onEditUser,
  onDeleteUser,
  onChangePassword,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
}) => {
  const isMobile = useIsMobile();

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {hasActiveFilters 
            ? 'Aucun utilisateur ne correspond aux filtres actuels.' 
            : 'Aucun utilisateur trouvé.'
          }
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-primary hover:underline mt-2"
          >
            Effacer les filtres
          </button>
        )}
      </div>
    );
  }

  if (view === 'table' && !isMobile) {
    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <UserTable
            users={paginatedUsers}
            onEditUser={onEditUser}
            onDeleteUser={onDeleteUser}
            onChangePassword={onChangePassword}
          />
        </div>
        
        {totalPages > 1 && (
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    );
  }

  return (
    <UserGrid
      users={filteredUsers}
      hasActiveFilters={hasActiveFilters}
      clearFilters={clearFilters}
      onEditUser={onEditUser}
      onDeleteUser={onDeleteUser}
      onChangePassword={onChangePassword}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={onPageChange}
    />
  );
};

export default UserListContent;

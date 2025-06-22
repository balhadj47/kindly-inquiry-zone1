
import React, { useState, useCallback } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { User } from '@/types/rbac';
import UserFilters from './UserFilters';
import UserViewToggle from './UserViewToggle';
import UserListContent from './UserListContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUsersFiltering } from '@/hooks/useUsersFiltering';
import { useUsersPagination } from '@/hooks/useUsersPagination';

interface UsersTabProps {
  users: User[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  clearFilters,
  hasActiveFilters,
  onEditUser,
  onDeleteUser,
  onChangePassword,
}) => {
  const isMobile = useIsMobile();
  const [view, setView] = useState<'grid' | 'table'>(isMobile ? 'grid' : 'table');
  
  const itemsPerPage = view === 'grid' ? (isMobile ? 6 : 12) : (isMobile ? 10 : 25);

  // Filter out employees (role_id: 3) from the Users tab - show only admins and supervisors
  const nonEmployeeUsers = users.filter(user => user.role_id !== 3);

  // Use our custom filtering hook with non-employee users
  const { safeUsers, filteredUsers, uniqueStatuses, uniqueRoles } = useUsersFiltering({
    users: nonEmployeeUsers,
    searchTerm,
    statusFilter,
    roleFilter,
  });

  // Use our custom pagination hook
  const { currentPage, totalPages, paginatedUsers, handlePageChange } = useUsersPagination({
    filteredUsers,
    itemsPerPage,
    searchTerm,
    statusFilter,
    roleFilter,
    view,
  });

  // Safe view change handler
  const handleViewChange = useCallback((newView: 'grid' | 'table') => {
    try {
      setView(newView);
    } catch (error) {
      console.error('Error changing view:', error);
    }
  }, []);

  console.log('UsersTab - Rendering with safe data:', {
    usersCount: safeUsers.length,
    searchTerm,
    statusFilter,
    roleFilter,
    view,
    currentPage,
    filteredUsersCount: filteredUsers.length,
    totalPages,
    paginatedUsersCount: paginatedUsers.length,
    isMobile
  });

  return (
    <TabsContent value="users" className="space-y-4">
      <div className="space-y-4">
        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          uniqueStatuses={uniqueStatuses}
          uniqueRoles={uniqueRoles}
          filteredCount={filteredUsers.length}
          totalCount={safeUsers.length}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
        />
        
        {!isMobile && (
          <div className="flex justify-end">
            <UserViewToggle
              view={view}
              onViewChange={handleViewChange}
            />
          </div>
        )}
      </div>

      <UserListContent
        view={view}
        filteredUsers={filteredUsers}
        paginatedUsers={paginatedUsers}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        onEditUser={onEditUser}
        onDeleteUser={onDeleteUser}
        onChangePassword={onChangePassword}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
      />
    </TabsContent>
  );
};

export default UsersTab;

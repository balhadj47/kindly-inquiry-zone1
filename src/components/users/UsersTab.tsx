
import React, { useState, useCallback } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { User } from '@/types/rbac';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUsersFiltering } from '@/hooks/useUsersFiltering';
import { useUsersPagination } from '@/hooks/useUsersPagination';
import { useNonEmployeeUsers } from './hooks/useNonEmployeeUsers';
import { useSafeUserHandlers } from './hooks/useSafeUserHandlers';
import UserFilters from './UserFilters';
import UserViewToggle from './UserViewToggle';
import UserListContent from './UserListContent';

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

  const nonEmployeeUsers = useNonEmployeeUsers(users);

  const filteringResult = useUsersFiltering({
    users: nonEmployeeUsers,
    searchTerm: searchTerm || '',
    statusFilter: statusFilter || '',
    roleFilter: roleFilter || '',
  });

  const { 
    safeUsers = [], 
    filteredUsers = [], 
    uniqueStatuses = [], 
    uniqueRoles = [] 
  } = filteringResult || {};

  const paginationResult = useUsersPagination({
    filteredUsers: filteredUsers,
    itemsPerPage,
    searchTerm: searchTerm || '',
    statusFilter: statusFilter || '',
    roleFilter: roleFilter || '',
    view,
  });

  const { 
    currentPage = 1, 
    totalPages = 1, 
    paginatedUsers = [], 
    handlePageChange = () => {} 
  } = paginationResult || {};

  const handleViewChange = useCallback((newView: 'grid' | 'table') => {
    try {
      if (!newView || (newView !== 'grid' && newView !== 'table')) {
        return;
      }
      setView(newView);
    } catch (error) {
      // Handle error silently
    }
  }, []);

  const { safeOnEditUser, safeOnDeleteUser, safeOnChangePassword } = useSafeUserHandlers({
    onEditUser,
    onDeleteUser,
    onChangePassword,
  });

  return (
    <TabsContent value="users" className="space-y-4">
      <div className="space-y-4">
        <UserFilters
          searchTerm={searchTerm || ''}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter || ''}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter || ''}
          setRoleFilter={setRoleFilter}
          uniqueStatuses={uniqueStatuses}
          uniqueRoles={uniqueRoles}
          filteredCount={filteredUsers.length}
          totalCount={safeUsers.length}
          hasActiveFilters={hasActiveFilters || false}
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
        hasActiveFilters={hasActiveFilters || false}
        clearFilters={clearFilters}
        onEditUser={safeOnEditUser}
        onDeleteUser={safeOnDeleteUser}
        onChangePassword={safeOnChangePassword}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
      />
    </TabsContent>
  );
};

export default UsersTab;

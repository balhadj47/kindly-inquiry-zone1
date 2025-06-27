
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

  console.log('👥 UsersTab: Starting with users:', {
    usersCount: Array.isArray(users) ? users.length : 'not array',
    usersType: typeof users,
    searchTerm,
    statusFilter,
    roleFilter
  });

  // Safely filter out employees (role_id: 3) from the Users tab - show only admins and supervisors
  const nonEmployeeUsers = React.useMemo(() => {
    try {
      if (!Array.isArray(users)) {
        console.warn('👥 UsersTab: users is not an array:', typeof users);
        return [];
      }
      
      const filtered = users.filter(user => {
        if (!user || typeof user !== 'object') {
          console.warn('👥 UsersTab: Invalid user object:', user);
          return false;
        }
        // Safe check for role_id
        return user.role_id !== 3;
      });
      
      console.log('👥 UsersTab: Filtered non-employee users:', filtered.length);
      return filtered;
    } catch (error) {
      console.error('👥 UsersTab: Error filtering non-employee users:', error);
      return [];
    }
  }, [users]);

  // Use our custom filtering hook with non-employee users
  const { safeUsers, filteredUsers, uniqueStatuses, uniqueRoles } = useUsersFiltering({
    users: nonEmployeeUsers,
    searchTerm: searchTerm || '',
    statusFilter: statusFilter || '',
    roleFilter: roleFilter || '',
  });

  // Use our custom pagination hook
  const { currentPage, totalPages, paginatedUsers, handlePageChange } = useUsersPagination({
    filteredUsers: filteredUsers || [],
    itemsPerPage,
    searchTerm: searchTerm || '',
    statusFilter: statusFilter || '',
    roleFilter: roleFilter || '',
    view,
  });

  // Safe view change handler
  const handleViewChange = useCallback((newView: 'grid' | 'table') => {
    try {
      console.log('👥 UsersTab: View change requested:', newView);
      setView(newView);
    } catch (error) {
      console.error('👥 UsersTab: Error changing view:', error);
    }
  }, []);

  // Safe handler wrappers with proper null checks
  const safeOnEditUser = useCallback((user: User) => {
    try {
      if (!user || !user.id) {
        console.warn('👥 UsersTab: Invalid user for edit:', user);
        return;
      }
      onEditUser(user);
    } catch (error) {
      console.error('👥 UsersTab: Error in edit user handler:', error);
    }
  }, [onEditUser]);

  const safeOnDeleteUser = useCallback((user: User) => {
    try {
      if (!user || !user.id) {
        console.warn('👥 UsersTab: Invalid user for delete:', user);
        return;
      }
      onDeleteUser(user);
    } catch (error) {
      console.error('👥 UsersTab: Error in delete user handler:', error);
    }
  }, [onDeleteUser]);

  const safeOnChangePassword = useCallback((user: User) => {
    try {
      if (!user || !user.id) {
        console.warn('👥 UsersTab: Invalid user for password change:', user);
        return;
      }
      onChangePassword(user);
    } catch (error) {
      console.error('👥 UsersTab: Error in change password handler:', error);
    }
  }, [onChangePassword]);

  console.log('👥 UsersTab: Rendering with processed data:', {
    nonEmployeeUsersCount: nonEmployeeUsers.length,
    safeUsersCount: safeUsers?.length || 0,
    filteredUsersCount: filteredUsers?.length || 0,
    paginatedUsersCount: paginatedUsers?.length || 0,
    currentPage,
    totalPages,
    view,
    isMobile
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
          uniqueStatuses={uniqueStatuses || []}
          uniqueRoles={uniqueRoles || []}
          filteredCount={filteredUsers?.length || 0}
          totalCount={safeUsers?.length || 0}
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
        filteredUsers={filteredUsers || []}
        paginatedUsers={paginatedUsers || []}
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

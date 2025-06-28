
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
    usersValue: users,
    searchTerm,
    statusFilter,
    roleFilter
  });

  // Enhanced filtering with comprehensive error handling for non-employee users
  const nonEmployeeUsers = React.useMemo(() => {
    try {
      // Handle null/undefined users
      if (!users) {
        console.warn('⚠️ UsersTab: Users data is null/undefined');
        return [];
      }
      
      if (!Array.isArray(users)) {
        console.warn('⚠️ UsersTab: Users is not an array:', typeof users, users);
        return [];
      }
      
      const filtered = users.filter(user => {
        // Comprehensive null checks
        if (!user) {
          console.warn('⚠️ UsersTab: Null user object found');
          return false;
        }
        
        if (typeof user !== 'object') {
          console.warn('⚠️ UsersTab: Invalid user object type:', typeof user);
          return false;
        }
        
        // Safe role_id check with multiple fallbacks
        const roleId = user.role_id;
        if (roleId === null || roleId === undefined) {
          console.warn('⚠️ UsersTab: User missing role_id:', user);
          return true; // Include users without role_id (might be admins)
        }
        
        // Filter out employees (role_id: 4) - show only admins and supervisors
        return roleId !== 4;
      });
      
      console.log('✅ UsersTab: Filtered non-employee users:', {
        originalCount: users.length,
        filteredCount: filtered.length,
        filtered: filtered.map(u => ({ id: u.id, name: u.name, role_id: u.role_id }))
      });
      
      return filtered;
    } catch (error) {
      console.error('❌ UsersTab: Critical error filtering non-employee users:', error);
      return [];
    }
  }, [users]);

  // Use our custom filtering hook with enhanced error handling
  const filteringResult = useUsersFiltering({
    users: nonEmployeeUsers,
    searchTerm: searchTerm || '',
    statusFilter: statusFilter || '',
    roleFilter: roleFilter || '',
  });

  // Safe destructuring with fallbacks
  const { 
    safeUsers = [], 
    filteredUsers = [], 
    uniqueStatuses = [], 
    uniqueRoles = [] 
  } = filteringResult || {};

  // Use our custom pagination hook with error handling
  const paginationResult = useUsersPagination({
    filteredUsers: filteredUsers,
    itemsPerPage,
    searchTerm: searchTerm || '',
    statusFilter: statusFilter || '',
    roleFilter: roleFilter || '',
    view,
  });

  // Safe destructuring with fallbacks
  const { 
    currentPage = 1, 
    totalPages = 1, 
    paginatedUsers = [], 
    handlePageChange = () => {} 
  } = paginationResult || {};

  // Safe view change handler with error handling
  const handleViewChange = useCallback((newView: 'grid' | 'table') => {
    try {
      if (!newView || (newView !== 'grid' && newView !== 'table')) {
        console.warn('⚠️ UsersTab: Invalid view change requested:', newView);
        return;
      }
      console.log('👥 UsersTab: View change requested:', newView);
      setView(newView);
    } catch (error) {
      console.error('❌ UsersTab: Error changing view:', error);
    }
  }, []);

  // Enhanced handler wrappers with comprehensive validation
  const safeOnEditUser = useCallback((user: User) => {
    try {
      if (!user) {
        console.warn('⚠️ UsersTab: Attempted to edit null user');
        return;
      }
      
      if (typeof user !== 'object') {
        console.warn('⚠️ UsersTab: Invalid user object for edit:', typeof user);
        return;
      }
      
      if (!user.id) {
        console.warn('⚠️ UsersTab: User missing ID for edit:', user);
        return;
      }
      
      console.log('✏️ UsersTab: Editing user:', user.id, user.name);
      onEditUser(user);
    } catch (error) {
      console.error('❌ UsersTab: Error in edit user handler:', error);
    }
  }, [onEditUser]);

  const safeOnDeleteUser = useCallback((user: User) => {
    try {
      if (!user) {
        console.warn('⚠️ UsersTab: Attempted to delete null user');
        return;
      }
      
      if (typeof user !== 'object') {
        console.warn('⚠️ UsersTab: Invalid user object for delete:', typeof user);
        return;
      }
      
      if (!user.id) {
        console.warn('⚠️ UsersTab: User missing ID for delete:', user);
        return;
      }
      
      console.log('🗑️ UsersTab: Deleting user:', user.id, user.name);
      onDeleteUser(user);
    } catch (error) {
      console.error('❌ UsersTab: Error in delete user handler:', error);
    }
  }, [onDeleteUser]);

  const safeOnChangePassword = useCallback((user: User) => {
    try {
      if (!user) {
        console.warn('⚠️ UsersTab: Attempted to change password for null user');
        return;
      }
      
      if (typeof user !== 'object') {
        console.warn('⚠️ UsersTab: Invalid user object for password change:', typeof user);
        return;
      }
      
      if (!user.id) {
        console.warn('⚠️ UsersTab: User missing ID for password change:', user);
        return;
      }
      
      console.log('🔑 UsersTab: Changing password for user:', user.id, user.name);
      onChangePassword(user);
    } catch (error) {
      console.error('❌ UsersTab: Error in change password handler:', error);
    }
  }, [onChangePassword]);

  console.log('👥 UsersTab: Rendering with processed data:', {
    nonEmployeeUsersCount: nonEmployeeUsers.length,
    safeUsersCount: safeUsers.length,
    filteredUsersCount: filteredUsers.length,
    paginatedUsersCount: paginatedUsers.length,
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

import React, { useState, useCallback } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { User } from '@/types/rbac';
import UserFilters from './UserFilters';
import UserViewToggle from './UserViewToggle';
import UserListContent from './UserListContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUsersFiltering } from '@/hooks/useUsersFiltering';
import { useUsersPagination } from '@/hooks/useUsersPagination';
import { useRBAC } from '@/contexts/RBACContext';

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
  const { roles } = useRBAC();
  const [view, setView] = useState<'grid' | 'table'>(isMobile ? 'grid' : 'table');
  
  const itemsPerPage = view === 'grid' ? (isMobile ? 6 : 12) : (isMobile ? 10 : 25);

  // Filter users based on permission count - show only users with higher permission counts (admins/supervisors)
  const nonEmployeeUsers = React.useMemo(() => {
    try {
      // Handle null/undefined users
      if (!users) {
        return [];
      }
      
      if (!Array.isArray(users)) {
        return [];
      }
      
      const filtered = users.filter(user => {
        // Comprehensive null checks
        if (!user) {
          return false;
        }
        
        if (typeof user !== 'object') {
          return false;
        }
        
        // Safe role_id check
        const roleId = user.role_id;
        if (roleId === null || roleId === undefined) {
          return true; // Include users without role_id (might be high-privilege users)
        }
        
        // Find the role in the roles array
        const userRole = roles.find(role => (role as any).role_id === roleId);
        if (!userRole) {
          return true; // Include users with unknown roles (safe assumption)
        }
        
        // Filter based on permission count - show users with more permissions (admins/supervisors)
        const permissionCount = userRole.permissions ? userRole.permissions.length : 0;
        const isHighPrivilegeUser = permissionCount >= 5; // Users with 5+ permissions are considered high-privilege
        
        return isHighPrivilegeUser;
      });
      
      return filtered;
    } catch (error) {
      return [];
    }
  }, [users, roles]);

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
        return;
      }
      setView(newView);
    } catch (error) {
      // Handle error silently
    }
  }, []);

  // Enhanced handler wrappers with comprehensive validation
  const safeOnEditUser = useCallback((user: User) => {
    try {
      if (!user) {
        return;
      }
      
      if (typeof user !== 'object') {
        return;
      }
      
      if (!user.id) {
        return;
      }
      
      onEditUser(user);
    } catch (error) {
      // Handle error silently
    }
  }, [onEditUser]);

  const safeOnDeleteUser = useCallback((user: User) => {
    try {
      if (!user) {
        return;
      }
      
      if (typeof user !== 'object') {
        return;
      }
      
      if (!user.id) {
        return;
      }
      
      onDeleteUser(user);
    } catch (error) {
      // Handle error silently
    }
  }, [onDeleteUser]);

  const safeOnChangePassword = useCallback((user: User) => {
    try {
      if (!user) {
        return;
      }
      
      if (typeof user !== 'object') {
        return;
      }
      
      if (!user.id) {
        return;
      }
      
      onChangePassword(user);
    } catch (error) {
      // Handle error silently
    }
  }, [onChangePassword]);

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


import { useMemo } from 'react';
import { User } from '@/types/rbac';

interface UseUsersFilteringProps {
  users: User[];
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
}

export const useUsersFiltering = ({
  users,
  searchTerm,
  statusFilter,
  roleFilter,
}: UseUsersFilteringProps) => {
  // Add comprehensive safety checks for arrays
  const safeUsers = useMemo(() => {
    if (!Array.isArray(users)) {
      console.warn('useUsersFiltering - users is not an array:', typeof users);
      return [];
    }
    return users.filter(user => user && typeof user === 'object' && user.id);
  }, [users]);

  // Memoize search term processing
  const normalizedSearchTerm = useMemo(() => 
    typeof searchTerm === 'string' ? searchTerm.toLowerCase().trim() : '',
    [searchTerm]
  );

  // Memoize filter functions for better performance
  const filterFunctions = useMemo(() => ({
    searchFilter: (user: User) => {
      if (!normalizedSearchTerm) return true;
      return (
        (user.name && user.name.toLowerCase().includes(normalizedSearchTerm)) ||
        (user.email && user.email.toLowerCase().includes(normalizedSearchTerm)) ||
        (user.licenseNumber && user.licenseNumber.toLowerCase().includes(normalizedSearchTerm))
      );
    },
    statusFilter: (user: User) => !statusFilter || statusFilter === 'all' || user.status === statusFilter,
    roleFilter: (user: User) => !roleFilter || roleFilter === 'all' || user.systemGroup === roleFilter
  }), [normalizedSearchTerm, statusFilter, roleFilter]);

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    try {
      return safeUsers.filter(user => {
        if (!user || typeof user !== 'object') {
          console.warn('useUsersFiltering - Invalid user object:', user);
          return false;
        }

        return (
          filterFunctions.searchFilter(user) &&
          filterFunctions.statusFilter(user) &&
          filterFunctions.roleFilter(user)
        );
      });
    } catch (error) {
      console.error('Error filtering users:', error);
      return [];
    }
  }, [safeUsers, filterFunctions]);

  // Memoize unique values with better performance
  const uniqueStatuses = useMemo(() => {
    try {
      const statusSet = new Set<string>();
      safeUsers.forEach(user => {
        if (user?.status && typeof user.status === 'string') {
          statusSet.add(user.status);
        }
      });
      return Array.from(statusSet);
    } catch (error) {
      console.error('Error calculating unique statuses:', error);
      return [];
    }
  }, [safeUsers]);

  const uniqueRoles = useMemo(() => {
    try {
      const rolesSet = new Set<string>();
      safeUsers.forEach(user => {
        if (user?.systemGroup && typeof user.systemGroup === 'string') {
          rolesSet.add(user.systemGroup);
        }
      });
      return Array.from(rolesSet);
    } catch (error) {
      console.error('Error calculating unique roles:', error);
      return [];
    }
  }, [safeUsers]);

  return {
    safeUsers,
    filteredUsers,
    uniqueStatuses,
    uniqueRoles,
  };
};

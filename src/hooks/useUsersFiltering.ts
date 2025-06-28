
import { useMemo } from 'react';
import { User } from '@/types/rbac';
import { useRoleData } from '@/hooks/useRoleData';

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
  console.log('🔍 useUsersFiltering: Starting with:', {
    usersCount: Array.isArray(users) ? users.length : 'not array',
    usersType: typeof users,
    searchTerm,
    statusFilter,
    roleFilter
  });

  // Add comprehensive safety checks for arrays
  const safeUsers = useMemo(() => {
    try {
      if (!Array.isArray(users)) {
        console.warn('🔍 useUsersFiltering: users is not an array:', typeof users);
        return [];
      }
      
      const validUsers = users.filter(user => {
        if (!user || typeof user !== 'object') {
          console.warn('🔍 useUsersFiltering: Invalid user object:', user);
          return false;
        }
        if (!user.id) {
          console.warn('🔍 useUsersFiltering: User missing ID:', user);
          return false;
        }
        return true;
      });
      
      console.log('🔍 useUsersFiltering: Safe users processed:', validUsers.length);
      return validUsers;
    } catch (error) {
      console.error('🔍 useUsersFiltering: Error processing safe users:', error);
      return [];
    }
  }, [users]);

  // Memoize search term processing
  const normalizedSearchTerm = useMemo(() => {
    try {
      const term = typeof searchTerm === 'string' ? searchTerm.toLowerCase().trim() : '';
      console.log('🔍 useUsersFiltering: Normalized search term:', term);
      return term;
    } catch (error) {
      console.error('🔍 useUsersFiltering: Error normalizing search term:', error);
      return '';
    }
  }, [searchTerm]);

  // Get unique roles for filtering (we'll need to resolve these)
  const uniqueRoles = useMemo(() => {
    try {
      const rolesSet = new Set<string>();
      safeUsers.forEach(user => {
        try {
          if (user?.role_id && typeof user.role_id === 'number') {
            // We'll use role_id as a string for now since we can't easily get role names in a memoized hook
            rolesSet.add(`Role ${user.role_id}`);
          }
        } catch (error) {
          console.warn('🔍 useUsersFiltering: Error processing role for user:', user?.id, error);
        }
      });
      const roles = Array.from(rolesSet);
      console.log('🔍 useUsersFiltering: Unique roles:', roles);
      return roles;
    } catch (error) {
      console.error('🔍 useUsersFiltering: Error calculating unique roles:', error);
      return [];
    }
  }, [safeUsers]);

  // Memoize filter functions for better performance
  const filterFunctions = useMemo(() => {
    try {
      return {
        searchFilter: (user: User) => {
          try {
            if (!normalizedSearchTerm) return true;
            const name = (user.name || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const licenseNumber = (user.licenseNumber || '').toLowerCase();
            
            return name.includes(normalizedSearchTerm) || 
                   email.includes(normalizedSearchTerm) || 
                   licenseNumber.includes(normalizedSearchTerm);
          } catch (error) {
            console.warn('🔍 useUsersFiltering: Error in search filter for user:', user.id, error);
            return false;
          }
        },
        statusFilter: (user: User) => {
          try {
            if (!statusFilter || statusFilter === 'all') return true;
            return user.status === statusFilter;
          } catch (error) {
            console.warn('🔍 useUsersFiltering: Error in status filter for user:', user.id, error);
            return false;
          }
        },
        roleFilter: (user: User) => {
          try {
            if (!roleFilter || roleFilter === 'all') return true;
            // For now, we'll use a simple role_id comparison since we can't async resolve in a memo
            return `Role ${user.role_id}` === roleFilter;
          } catch (error) {
            console.warn('🔍 useUsersFiltering: Error in role filter for user:', user.id, error);
            return false;
          }
        }
      };
    } catch (error) {
      console.error('🔍 useUsersFiltering: Error creating filter functions:', error);
      return {
        searchFilter: () => true,
        statusFilter: () => true,
        roleFilter: () => true
      };
    }
  }, [normalizedSearchTerm, statusFilter, roleFilter]);

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    try {
      console.log('🔍 useUsersFiltering: Applying filters to', safeUsers.length, 'users');
      
      const filtered = safeUsers.filter(user => {
        try {
          if (!user || typeof user !== 'object') {
            console.warn('🔍 useUsersFiltering: Invalid user object during filtering:', user);
            return false;
          }

          const searchMatch = filterFunctions.searchFilter(user);
          const statusMatch = filterFunctions.statusFilter(user);
          const roleMatch = filterFunctions.roleFilter(user);
          
          return searchMatch && statusMatch && roleMatch;
        } catch (error) {
          console.error('🔍 useUsersFiltering: Error filtering individual user:', user?.id, error);
          return false;
        }
      });
      
      console.log('🔍 useUsersFiltering: Filtered results:', filtered.length, 'of', safeUsers.length);
      return filtered;
    } catch (error) {
      console.error('🔍 useUsersFiltering: Error during filtering process:', error);
      return [];
    }
  }, [safeUsers, filterFunctions]);

  // Memoize unique values with better performance
  const uniqueStatuses = useMemo(() => {
    try {
      const statusSet = new Set<string>();
      safeUsers.forEach(user => {
        try {
          if (user?.status && typeof user.status === 'string') {
            statusSet.add(user.status);
          }
        } catch (error) {
          console.warn('🔍 useUsersFiltering: Error processing status for user:', user?.id, error);
        }
      });
      const statuses = Array.from(statusSet);
      console.log('🔍 useUsersFiltering: Unique statuses:', statuses);
      return statuses;
    } catch (error) {
      console.error('🔍 useUsersFiltering: Error calculating unique statuses:', error);
      return [];
    }
  }, [safeUsers]);

  const result = {
    safeUsers,
    filteredUsers,
    uniqueStatuses,
    uniqueRoles,
  };

  console.log('🔍 useUsersFiltering: Final result:', {
    safeUsersCount: result.safeUsers.length,
    filteredUsersCount: result.filteredUsers.length,
    uniqueStatusesCount: result.uniqueStatuses.length,
    uniqueRolesCount: result.uniqueRoles.length
  });

  return result;
};

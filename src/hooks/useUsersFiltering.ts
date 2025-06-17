
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

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    try {
      return safeUsers.filter(user => {
        if (!user || typeof user !== 'object') {
          console.warn('useUsersFiltering - Invalid user object:', user);
          return false;
        }

        const safeSearchTerm = typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';
        
        const matchesSearch = !safeSearchTerm || 
          (user.name && user.name.toLowerCase().includes(safeSearchTerm)) ||
          (user.email && user.email.toLowerCase().includes(safeSearchTerm)) ||
          (user.licenseNumber && user.licenseNumber.toLowerCase().includes(safeSearchTerm));

        const matchesStatus = !statusFilter || statusFilter === 'all' || user.status === statusFilter;
        const matchesRole = !roleFilter || roleFilter === 'all' || user.systemGroup === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
      });
    } catch (error) {
      console.error('Error filtering users:', error);
      return [];
    }
  }, [safeUsers, searchTerm, statusFilter, roleFilter]);

  // Memoize unique values
  const uniqueStatuses = useMemo(() => {
    try {
      const statuses = safeUsers
        .map(user => user?.status)
        .filter(status => status && typeof status === 'string');
      return [...new Set(statuses)];
    } catch (error) {
      console.error('Error calculating unique statuses:', error);
      return [];
    }
  }, [safeUsers]);

  const uniqueRoles = useMemo(() => {
    try {
      const roles = safeUsers
        .map(user => user?.systemGroup)
        .filter(role => role && typeof role === 'string');
      return [...new Set(roles)];
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


import { useMemo } from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import type { User } from '@/types/rbac';

export const useUserFiltering = (searchQuery: string) => {
  const { users } = useRBAC();
  
  console.log('🔍 useUserFiltering: Starting with search query:', searchQuery);
  console.log('🔍 useUserFiltering: Available users:', users?.length || 0);

  const filteredUsers = useMemo(() => {
    try {
      if (!users || !Array.isArray(users)) {
        console.warn('🔍 useUserFiltering: Users data not available or invalid');
        return [];
      }

      if (!searchQuery || searchQuery.trim() === '') {
        console.log('🔍 useUserFiltering: No search query, returning all users');
        return users;
      }

      const query = searchQuery.toLowerCase().trim();
      const filtered = users.filter((user: User) => {
        if (!user || typeof user !== 'object') {
          console.warn('🔍 useUserFiltering: Invalid user object:', user);
          return false;
        }

        const name = user.name?.toLowerCase() || '';
        const email = user.email?.toLowerCase() || '';
        const licenseNumber = user.licenseNumber?.toLowerCase() || '';
        
        return name.includes(query) || 
               email.includes(query) || 
               licenseNumber.includes(query);
      });

      console.log('🔍 useUserFiltering: Filtered', filtered.length, 'users from', users.length);
      return filtered;
    } catch (error) {
      console.error('🔍 useUserFiltering: Error filtering users:', error);
      return [];
    }
  }, [users, searchQuery]);

  const totalFilteredUsers = filteredUsers?.length || 0;

  console.log('🔍 useUserFiltering: Final result:', {
    totalUsers: users?.length || 0,
    filteredUsers: totalFilteredUsers,
    searchQuery
  });

  return {
    filteredUsers: filteredUsers || [],
    totalFilteredUsers,
    users: users || []
  };
};

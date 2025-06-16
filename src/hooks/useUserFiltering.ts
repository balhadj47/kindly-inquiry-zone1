
import { useMemo } from 'react';
import { useRBAC } from '@/contexts/RBACContext';

export const useUserFiltering = (userSearchQuery: string) => {
  const { users } = useRBAC();

  // Filter users by search query
  const filteredUsers = useMemo(() => {
    const filtered = userSearchQuery.trim() 
      ? users.filter(user => 
          user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
        )
      : users;

    // Sort users: active users first, then inactive users
    return filtered.sort((a, b) => {
      const aIsActive = a.status === 'Active';
      const bIsActive = b.status === 'Active';
      
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      return 0;
    });
  }, [users, userSearchQuery]);

  return {
    filteredUsers,
    totalFilteredUsers: filteredUsers.length,
    users,
  };
};

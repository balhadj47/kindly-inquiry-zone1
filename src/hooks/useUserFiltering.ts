
import { useMemo } from 'react';
import { useRBAC } from '@/contexts/RBACContext';

export const useUserFiltering = (userSearchQuery: string) => {
  const { users, groups } = useRBAC();

  // Group users by their group ID and filter by search query
  const groupedUsers = useMemo(() => {
    const filtered = userSearchQuery.trim() 
      ? users.filter(user => 
          user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
        )
      : users;

    const grouped = filtered.reduce((acc, user) => {
      const groupId = user.groupId;
      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push(user);
      return acc;
    }, {} as Record<string, typeof users>);

    // Sort users within each group: active users first, then inactive users
    Object.keys(grouped).forEach(groupId => {
      grouped[groupId].sort((a, b) => {
        const aIsActive = a.status === 'Active';
        const bIsActive = b.status === 'Active';
        
        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;
        return 0;
      });
    });

    return grouped;
  }, [users, userSearchQuery]);

  // Sort groups with admin and employee groups at the end
  const sortedGroupEntries = useMemo(() => {
    const entries = Object.entries(groupedUsers);
    const adminAndEmployeeGroups = ['admin', 'employee'];
    
    const regularGroups = entries.filter(([groupId]) => !adminAndEmployeeGroups.includes(groupId));
    const adminEmployeeGroups = entries.filter(([groupId]) => adminAndEmployeeGroups.includes(groupId));
    
    return [...regularGroups, ...adminEmployeeGroups];
  }, [groupedUsers]);

  // Get total filtered users count
  const totalFilteredUsers = Object.values(groupedUsers).flat().length;

  return {
    sortedGroupEntries,
    totalFilteredUsers,
    groups,
    users,
  };
};

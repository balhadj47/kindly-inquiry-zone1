
import { useState, useEffect } from 'react';
import { clearPermissionCache } from './permissionUtils';
import type { User, UserGroup, Permission } from '@/types/rbac';

export const useRBACState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false); // Changed from true to false

  const setUser = (user: User | null) => {
    // Clear permission cache when user changes
    if (currentUser?.id !== user?.id) {
      clearPermissionCache();
    }
    setCurrentUser(user);
  };

  // Clear cache when groups change
  useEffect(() => {
    clearPermissionCache();
  }, [groups]);

  return {
    currentUser,
    users,
    groups,
    permissions,
    loading,
    setCurrentUser,
    setUsers,
    setGroups,
    setPermissions,
    setLoading,
    setUser,
  };
};

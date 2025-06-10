
import { useState, useEffect } from 'react';
import { clearPermissionCache } from './permissionUtils';
import type { User, UserGroup, Permission } from '@/types/rbac';

export const useRBACState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true); // Changed back to true to ensure proper loading state

  const setUser = (user: User | null) => {
    console.log('Setting user in RBAC state:', user?.id);
    // Clear permission cache when user changes
    if (currentUser?.id !== user?.id) {
      clearPermissionCache();
    }
    setCurrentUser(user);
  };

  // Clear cache when groups change
  useEffect(() => {
    console.log('Groups changed, clearing permission cache. New groups count:', groups.length);
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

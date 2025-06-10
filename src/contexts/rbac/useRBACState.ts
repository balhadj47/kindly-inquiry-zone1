
import { useState, useEffect, useCallback } from 'react';
import { clearPermissionCache } from './permissionUtils';
import type { User, Group, Permission } from '@/types/rbac';

export const useRBACState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  // Safe setters with error handling
  const safeSetUsers = useCallback((newUsers: User[] | ((prev: User[]) => User[])) => {
    try {
      if (typeof newUsers === 'function') {
        setUsers(prev => {
          const result = newUsers(prev);
          return Array.isArray(result) ? result : [];
        });
      } else {
        setUsers(Array.isArray(newUsers) ? newUsers : []);
      }
    } catch (error) {
      console.error('Error setting users:', error);
      setUsers([]);
    }
  }, []);

  const safeSetGroups = useCallback((newGroups: Group[] | ((prev: Group[]) => Group[])) => {
    try {
      if (typeof newGroups === 'function') {
        setGroups(prev => {
          const result = newGroups(prev);
          return Array.isArray(result) ? result : [];
        });
      } else {
        setGroups(Array.isArray(newGroups) ? newGroups : []);
      }
    } catch (error) {
      console.error('Error setting groups:', error);
      setGroups([]);
    }
  }, []);

  const safeSetPermissions = useCallback((newPermissions: Permission[] | ((prev: Permission[]) => Permission[])) => {
    try {
      if (typeof newPermissions === 'function') {
        setPermissions(prev => {
          const result = newPermissions(prev);
          return Array.isArray(result) ? result : [];
        });
      } else {
        setPermissions(Array.isArray(newPermissions) ? newPermissions : []);
      }
    } catch (error) {
      console.error('Error setting permissions:', error);
      setPermissions([]);
    }
  }, []);

  const safeSetCurrentUser = useCallback((user: User | null) => {
    try {
      console.log('Setting user in RBAC state:', user?.id);
      // Clear permission cache when user changes
      if (currentUser?.id !== user?.id) {
        clearPermissionCache();
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Error setting current user:', error);
      setCurrentUser(null);
    }
  }, [currentUser?.id]);

  const safeSetLoading = useCallback((isLoading: boolean) => {
    try {
      setLoading(Boolean(isLoading));
    } catch (error) {
      console.error('Error setting loading state:', error);
      setLoading(false);
    }
  }, []);

  const setUser = useCallback((user: User | null) => {
    safeSetCurrentUser(user);
  }, [safeSetCurrentUser]);

  // Clear cache when groups change
  useEffect(() => {
    try {
      console.log('Groups changed, clearing permission cache. New groups count:', groups.length);
      clearPermissionCache();
    } catch (error) {
      console.error('Error clearing permission cache on groups change:', error);
    }
  }, [groups]);

  return {
    currentUser,
    users,
    groups,
    permissions,
    loading,
    setCurrentUser: safeSetCurrentUser,
    setUsers: safeSetUsers,
    setGroups: safeSetGroups,
    setPermissions: safeSetPermissions,
    setLoading: safeSetLoading,
    setUser,
  };
};

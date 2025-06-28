
import { useState, useEffect, useCallback } from 'react';
import { clearPermissionCache } from './permissionUtils';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

export const useRBACStateClean = () => {
  console.log('🔧 useRBACStateClean: Initializing RBAC state...');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<SystemGroup[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]); // Changed from Permission[] to string[]
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

  const safeSetRoles = useCallback((newRoles: SystemGroup[] | ((prev: SystemGroup[]) => SystemGroup[])) => {
    try {
      if (typeof newRoles === 'function') {
        setRoles(prev => {
          const result = newRoles(prev);
          return Array.isArray(result) ? result : [];
        });
      } else {
        setRoles(Array.isArray(newRoles) ? newRoles : []);
      }
    } catch (error) {
      console.error('Error setting roles:', error);
      setRoles([]);
    }
  }, []);

  const safeSetPermissions = useCallback((newPermissions: string[] | ((prev: string[]) => string[])) => {
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

  // Clear cache when roles change
  useEffect(() => {
    try {
      console.log('System groups changed, clearing permission cache. New groups count:', roles.length);
      clearPermissionCache();
    } catch (error) {
      console.error('Error clearing permission cache on roles change:', error);
    }
  }, [roles]);

  // Return structured state and actions
  return {
    state: {
      currentUser,
      users,
      roles,
      permissions,
      loading,
    },
    actions: {
      setCurrentUser: safeSetCurrentUser,
      setUsers: safeSetUsers,
      setRoles: safeSetRoles,
      setPermissions: safeSetPermissions,
      setLoading: safeSetLoading,
      setUser,
    }
  };
};

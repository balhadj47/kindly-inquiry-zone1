
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

export const useRBACStateClean = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<SystemGroup[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
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
      setPermissions([]);
    }
  }, []);

  const safeSetCurrentUser = useCallback((user: User | null) => {
    try {
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    }
  }, []);

  const safeSetLoading = useCallback((isLoading: boolean) => {
    try {
      setLoading(Boolean(isLoading));
    } catch (error) {
      setLoading(false);
    }
  }, []);

  // Return state and actions directly (not nested)
  return {
    currentUser,
    users,
    roles,
    permissions,
    loading,
    setCurrentUser: safeSetCurrentUser,
    setUsers: safeSetUsers,
    setRoles: safeSetRoles,
    setPermissions: safeSetPermissions,
    setLoading: safeSetLoading,
    setUser: safeSetCurrentUser, // Alias for compatibility
  };
};

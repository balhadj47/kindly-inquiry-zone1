
import { useState, useCallback } from 'react';
import type { User } from '@/types/rbac';
import type { SystemGroup } from '@/types/systemGroups';

export const useRBACStateFinal = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsersState] = useState<User[]>([]);
  const [roles, setRoles] = useState<SystemGroup[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Safe setter for users with validation
  const setUsers = useCallback((usersOrUpdater: User[] | ((prev: User[]) => User[])) => {
    console.log('🔄 useRBACStateFinal: setUsers called with:', typeof usersOrUpdater);
    
    if (typeof usersOrUpdater === 'function') {
      setUsersState(prev => {
        const newUsers = usersOrUpdater(prev);
        console.log('🔄 useRBACStateFinal: Updater function result:', newUsers?.length || 0);
        
        if (!Array.isArray(newUsers)) {
          console.warn('🔄 useRBACStateFinal: Invalid users data from updater, keeping previous state');
          return prev;
        }
        
        // Validate each user object
        const validUsers = newUsers.filter(user => {
          if (!user || typeof user !== 'object') {
            console.warn('🔄 useRBACStateFinal: Invalid user object:', user);
            return false;
          }
          if (!user.id || !user.name) {
            console.warn('🔄 useRBACStateFinal: User missing required fields:', user);
            return false;
          }
          return true;
        });
        
        console.log('🔄 useRBACStateFinal: Validated users:', validUsers.length);
        return validUsers;
      });
    } else {
      console.log('🔄 useRBACStateFinal: Direct users array:', usersOrUpdater?.length || 0);
      
      if (!Array.isArray(usersOrUpdater)) {
        console.warn('🔄 useRBACStateFinal: Invalid users data, keeping current state');
        return;
      }
      
      // Validate each user object
      const validUsers = usersOrUpdater.filter(user => {
        if (!user || typeof user !== 'object') {
          console.warn('🔄 useRBACStateFinal: Invalid user object:', user);
          return false;
        }
        if (!user.id || !user.name) {
          console.warn('🔄 useRBACStateFinal: User missing required fields:', user);
          return false;
        }
        return true;
      });
      
      console.log('🔄 useRBACStateFinal: Setting validated users:', validUsers.length);
      setUsersState(validUsers);
    }
  }, []);

  const setUser = useCallback((user: User | null) => {
    console.log('🔄 useRBACStateFinal: setUser called with:', user?.id || 'null');
    setCurrentUser(user);
  }, []);

  console.log('🔄 useRBACStateFinal: Current state:', {
    currentUser: currentUser?.id || 'null',
    usersCount: users.length,
    rolesCount: roles.length,
    loading
  });

  return {
    currentUser,
    users,
    roles,
    permissions,
    loading,
    setCurrentUser,
    setUsers,
    setRoles,
    setPermissions,
    setLoading,
    setUser,
  };
};

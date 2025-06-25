
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
    
    try {
      if (typeof usersOrUpdater === 'function') {
        setUsersState(prev => {
          try {
            const newUsers = usersOrUpdater(prev || []);
            console.log('🔄 useRBACStateFinal: Updater function result:', newUsers?.length || 0);
            
            if (!Array.isArray(newUsers)) {
              console.warn('🔄 useRBACStateFinal: Invalid users data from updater, keeping previous state');
              return prev || [];
            }
            
            // Validate each user object
            const validUsers = (newUsers || []).filter(user => {
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
          } catch (error) {
            console.error('🔄 useRBACStateFinal: Error in updater function:', error);
            return prev || [];
          }
        });
      } else {
        console.log('🔄 useRBACStateFinal: Direct users array:', usersOrUpdater?.length || 0);
        
        if (!Array.isArray(usersOrUpdater)) {
          console.warn('🔄 useRBACStateFinal: Invalid users data, keeping current state');
          return;
        }
        
        // Validate each user object
        const validUsers = (usersOrUpdater || []).filter(user => {
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
    } catch (error) {
      console.error('🔄 useRBACStateFinal: Error in setUsers:', error);
    }
  }, []);

  const setUser = useCallback((user: User | null) => {
    try {
      console.log('🔄 useRBACStateFinal: setUser called with:', user?.id || 'null');
      setCurrentUser(user);
    } catch (error) {
      console.error('🔄 useRBACStateFinal: Error in setUser:', error);
    }
  }, []);

  console.log('🔄 useRBACStateFinal: Current state:', {
    currentUser: currentUser?.id || 'null',
    usersCount: users?.length || 0,
    rolesCount: roles?.length || 0,
    loading
  });

  return {
    currentUser,
    users: users || [],
    roles: roles || [],
    permissions: permissions || [],
    loading: loading || false,
    setCurrentUser,
    setUsers,
    setRoles,
    setPermissions,
    setLoading,
    setUser,
  };
};

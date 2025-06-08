
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserGroup, Permission } from '@/types/rbac';
import { RBACContextType, DEV_USER } from './types';
import { loadUsersFromDB, loadGroupsFromDB, loadDefaultData } from './dataLoaders';
import { createUserOperations } from './userOperations';
import { createGroupOperations } from './groupOperations';
import { createPermissionUtils } from './permissionUtils';

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRBACData = async () => {
      try {
        // Load default groups and permissions first
        const { DEFAULT_GROUPS, DEFAULT_PERMISSIONS } = await loadDefaultData();
        setGroups(DEFAULT_GROUPS);
        setPermissions(DEFAULT_PERMISSIONS);

        // Load users
        const formattedUsers = await loadUsersFromDB();
        setUsers(formattedUsers);

        // Load groups from database (override defaults if they exist)
        const dbGroups = await loadGroupsFromDB();
        if (dbGroups) {
          setGroups(dbGroups);
        }

        // For development: if no users exist in DB, use dev user
        if (formattedUsers.length === 0) {
          console.log('No users found in database, using development user');
          setCurrentUser(DEV_USER);
        } else {
          // In a real app, you'd get the current user from auth
          // For now, just use the first user or dev user
          setCurrentUser(formattedUsers[0] || DEV_USER);
        }

        console.log('RBAC data loaded successfully');
      } catch (error) {
        console.error('Error loading RBAC data:', error);
        // Fallback to dev user and default groups if there's an error
        setCurrentUser(DEV_USER);
        
        try {
          const { DEFAULT_GROUPS, DEFAULT_PERMISSIONS } = await loadDefaultData();
          setGroups(DEFAULT_GROUPS);
          setPermissions(DEFAULT_PERMISSIONS);
        } catch (importError) {
          console.error('Error importing default groups:', importError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRBACData();
  }, []);

  const setUser = (user: User | null) => {
    setCurrentUser(user);
  };

  // Create operation handlers
  const userOperations = createUserOperations(setUsers);
  const groupOperations = createGroupOperations(setGroups);
  const permissionUtils = createPermissionUtils(currentUser, groups);

  return (
    <RBACContext.Provider value={{
      currentUser,
      users,
      groups,
      permissions,
      loading,
      setUser,
      ...userOperations,
      ...groupOperations,
      ...permissionUtils,
    }}>
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

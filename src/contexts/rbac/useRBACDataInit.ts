
import { useEffect } from 'react';
import type { User, UserGroup, Permission } from '@/types/rbac';
import { DEV_USER } from './types';
import { loadUsersFromDB, loadGroupsFromDB, loadDefaultData } from './dataLoaders';

interface UseRBACDataInitProps {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setGroups: React.Dispatch<React.SetStateAction<UserGroup[]>>;
  setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useRBACDataInit = ({
  setUsers,
  setGroups,
  setPermissions,
  setCurrentUser,
  setLoading,
}: UseRBACDataInitProps) => {
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
  }, [setUsers, setGroups, setPermissions, setCurrentUser, setLoading]);
};

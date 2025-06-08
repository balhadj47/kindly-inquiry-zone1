
import { useEffect } from 'react';
import type { User, UserGroup, Permission } from '@/types/rbac';
import { useAuth } from '@/contexts/AuthContext';
import { loadUsersFromDB, loadGroupsFromDB, loadDefaultData, loadCurrentUserFromAuth } from './dataLoaders';

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
  const { user: authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    // Don't load RBAC data if auth is still loading
    if (authLoading) {
      return;
    }

    const loadRBACData = async () => {
      try {
        // Load default groups and permissions first
        const { DEFAULT_GROUPS, DEFAULT_PERMISSIONS } = await loadDefaultData();
        setGroups(DEFAULT_GROUPS);
        setPermissions(DEFAULT_PERMISSIONS);

        // Load users from database
        const formattedUsers = await loadUsersFromDB();
        setUsers(formattedUsers);

        // Load groups from database (override defaults if they exist)
        const dbGroups = await loadGroupsFromDB();
        if (dbGroups) {
          setGroups(dbGroups);
        }

        // Load current user from auth if authenticated
        if (authUser) {
          const currentUser = await loadCurrentUserFromAuth();
          setCurrentUser(currentUser);
          console.log('Authenticated user set as current user:', currentUser);
        } else {
          setCurrentUser(null);
          console.log('No authenticated user, current user set to null');
        }

        console.log('RBAC data loaded successfully');
      } catch (error) {
        console.error('Error loading RBAC data:', error);
        // Clear current user on error
        setCurrentUser(null);
        
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
  }, [authUser, authLoading, setUsers, setGroups, setPermissions, setCurrentUser, setLoading]);
};

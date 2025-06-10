
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserData, loadUsersData, loadGroupsData, loadPermissionsData } from './dataLoaders';
import { RBACUser, RBACGroup } from './types';

interface UseRBACDataInitProps {
  setUsers: React.Dispatch<React.SetStateAction<RBACUser[]>>;
  setGroups: React.Dispatch<React.SetStateAction<RBACGroup[]>>;
  setPermissions: React.Dispatch<React.SetStateAction<any[]>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<RBACUser | null>>;
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
  const initialized = useRef(false);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      console.log('RBAC Data Init - Auth user:', authUser?.id);
      console.log('RBAC Data Init - Auth loading:', authLoading);
      
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }

      // Check if we're dealing with the same user
      const currentUserId = authUser?.id || null;
      if (initialized.current && lastUserId.current === currentUserId) {
        console.log('RBAC already initialized for this user, skipping...');
        return;
      }

      if (!authUser) {
        console.log('No authenticated user, resetting RBAC state');
        setLoading(false);
        setCurrentUser(null);
        setUsers([]);
        setGroups([]);
        setPermissions([]);
        initialized.current = false;
        lastUserId.current = null;
        return;
      }

      console.log('Initializing RBAC data for user:', currentUserId);
      initialized.current = true;
      lastUserId.current = currentUserId;
      setLoading(true);
      
      try {
        // Load permissions first (they're static)
        console.log('Loading permissions data...');
        const permissionsData = await loadPermissionsData();
        setPermissions(permissionsData);

        // Load current user data
        console.log('Loading current user data...');
        const userData = await loadUserData();
        setCurrentUser(userData);

        // Load all users data
        console.log('Loading users data...');
        const usersData = await loadUsersData();
        setUsers(usersData);

        // Load groups data
        console.log('Loading groups data...');
        const groupsData = await loadGroupsData();
        setGroups(groupsData);

        console.log('RBAC data initialization complete');
      } catch (error) {
        console.error('Error loading RBAC data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [authUser?.id, authLoading, setUsers, setGroups, setPermissions, setCurrentUser, setLoading]);
};

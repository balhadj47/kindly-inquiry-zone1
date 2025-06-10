
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
  const initializationRef = useRef({
    initialized: false,
    lastUserId: null as string | null,
    isInitializing: false,
  });

  useEffect(() => {
    const initializeData = async () => {
      const currentUserId = authUser?.id || null;
      
      console.log('RBAC Data Init - Auth user:', currentUserId);
      console.log('RBAC Data Init - Auth loading:', authLoading);
      console.log('RBAC Data Init - Current state:', initializationRef.current);
      
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }

      // Prevent concurrent initializations
      if (initializationRef.current.isInitializing) {
        console.log('RBAC initialization already in progress, skipping...');
        return;
      }

      // Check if we're dealing with the same user and already initialized
      if (initializationRef.current.initialized && 
          initializationRef.current.lastUserId === currentUserId) {
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
        initializationRef.current = {
          initialized: false,
          lastUserId: null,
          isInitializing: false,
        };
        return;
      }

      console.log('Initializing RBAC data for user:', currentUserId);
      initializationRef.current.isInitializing = true;
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

        // Mark as successfully initialized
        initializationRef.current = {
          initialized: true,
          lastUserId: currentUserId,
          isInitializing: false,
        };

        console.log('RBAC data initialization complete');
      } catch (error) {
        console.error('Error loading RBAC data:', error);
        initializationRef.current.isInitializing = false;
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [authUser?.id, authLoading, setUsers, setGroups, setPermissions, setCurrentUser, setLoading]);
};

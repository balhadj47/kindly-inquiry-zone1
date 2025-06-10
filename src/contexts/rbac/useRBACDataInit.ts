
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserData, loadUsersData, loadGroupsData, loadPermissionsData } from './dataLoaders';
import { User, Group, Permission } from '@/types/rbac';

interface UseRBACDataInitProps {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
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

        // Load groups data (now role-based)
        console.log('Loading groups data...');
        const groupsData = await loadGroupsData();
        setGroups(groupsData);

        // Try to load current user data, but if it fails, create a default user
        console.log('Loading current user data...');
        try {
          const userData = await loadUserData();
          setCurrentUser(userData);
        } catch (error) {
          console.log('Failed to load user data, creating default user...');
          // Create a default user with basic permissions if we can't load from database
          const defaultUser: User = {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.full_name || authUser.email || 'User',
            phone: authUser.user_metadata?.phone || '',
            role: 'Employee',
            status: 'Active',
            groupId: 'Employee', // Use role as groupId
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(defaultUser);
        }

        // Load all users data
        console.log('Loading users data...');
        const usersData = await loadUsersData();
        setUsers(usersData);

        // Mark as successfully initialized
        initializationRef.current = {
          initialized: true,
          lastUserId: currentUserId,
          isInitializing: false,
        };

        console.log('RBAC data initialization complete');
      } catch (error) {
        console.error('Error loading RBAC data:', error);
        
        // Even if there's an error, try to create a basic working state
        if (authUser) {
          console.log('Creating fallback RBAC state...');
          
          // Create a default group with basic permissions (using permission IDs, not objects)
          const defaultGroup: Group = {
            id: 'Employee',
            name: 'Default Users',
            description: 'Default user group with basic permissions',
            color: '#3B82F6',
            permissions: [
              'dashboard:read',
              'companies:read',
              'vans:read',
              'trips:read',
              'trips:create',
            ],
          };
          
          setGroups([defaultGroup]);
          
          const defaultUser: User = {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.full_name || authUser.email || 'User',
            phone: authUser.user_metadata?.phone || '',
            role: 'Employee',
            status: 'Active',
            groupId: 'Employee', // Use role as groupId
            createdAt: new Date().toISOString(),
          };
          
          setCurrentUser(defaultUser);
          setUsers([defaultUser]);
        }
        
        initializationRef.current.isInitializing = false;
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [authUser?.id, authLoading, setUsers, setGroups, setPermissions, setCurrentUser, setLoading]);
};

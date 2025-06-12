
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadInitialData } from './dataLoaders';
import type { User, Group, Permission } from '@/types/rbac';

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
  const { user: authUser } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      try {
        console.log('Initializing RBAC data...');
        setLoading(true);
        
        const data = await loadInitialData(authUser);
        
        if (!isMounted) return;
        
        console.log('RBAC data loaded:', {
          usersCount: data.users.length,
          groupsCount: data.groups.length,
          permissionsCount: data.permissions.length,
          currentUser: data.currentUser?.id
        });
        
        setUsers(data.users);
        setGroups(data.groups);
        setPermissions(data.permissions);
        setCurrentUser(data.currentUser);
      } catch (error) {
        console.error('Error initializing RBAC data:', error);
        if (isMounted) {
          setUsers([]);
          setGroups([]);
          setPermissions([]);
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [authUser?.id, setUsers, setGroups, setPermissions, setCurrentUser, setLoading]);
};

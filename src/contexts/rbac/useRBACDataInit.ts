
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadInitialData } from './dataLoaders';
import type { User, Role, Permission } from '@/types/rbac';

interface UseRBACDataInitProps {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useRBACDataInit = ({
  setUsers,
  setRoles,
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
          rolesCount: data.roles.length,
          permissionsCount: data.permissions.length,
          currentUser: data.currentUser?.id
        });
        
        setUsers(data.users);
        setRoles(data.roles);
        setPermissions(data.permissions);
        setCurrentUser(data.currentUser);
      } catch (error) {
        console.error('Error initializing RBAC data:', error);
        if (isMounted) {
          setUsers([]);
          setRoles([]);
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
  }, [authUser?.id, setUsers, setRoles, setPermissions, setCurrentUser, setLoading]);
};

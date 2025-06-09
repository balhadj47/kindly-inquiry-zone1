
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserData, loadGroupsData } from './dataLoaders';
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

  useEffect(() => {
    const initializeData = async () => {
      console.log('RBAC Data Init - Auth user:', authUser);
      console.log('RBAC Data Init - Auth loading:', authLoading);
      
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }

      if (!authUser) {
        console.log('No authenticated user, resetting RBAC state');
        setLoading(false);
        setCurrentUser(null);
        return;
      }

      console.log('Loading user data for authenticated user:', authUser.id);
      setLoading(true);
      
      try {
        // Load user data
        console.log('Calling loadUserData...');
        const userData = await loadUserData();
        console.log('User data loaded:', userData);
        setCurrentUser(userData);

        // Load groups data
        console.log('Calling loadGroupsData...');
        const groupsData = await loadGroupsData();
        console.log('Groups data loaded:', groupsData);
        setGroups(groupsData);
      } catch (error) {
        console.error('Error loading RBAC data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [authUser, authLoading, setUsers, setGroups, setPermissions, setCurrentUser, setLoading]);
};

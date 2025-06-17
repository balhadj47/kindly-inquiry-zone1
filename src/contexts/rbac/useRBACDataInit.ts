
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadUsers, loadRoles } from './dataLoaders';
import { createPermissionUtils } from './permissionUtils';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

interface RBACState {
  currentUser: User | null;
  users: User[];
  roles: SystemGroup[];
  loading: boolean;
}

interface RBACActions {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>;
  setLoading: (loading: boolean) => void;
  setCurrentUser: (user: User | null) => void;
}

export const useRBACDataInit = (state: RBACState, actions: RBACActions) => {
  const { loading, users, roles } = state;
  const { setUsers, setRoles, setLoading, setCurrentUser } = actions;
  const { user: authUser } = useAuth();

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('🚀 Initializing RBAC data...');
        setLoading(true);

        // Load system groups first as they're needed for permission utils
        console.log('📊 Loading system groups...');
        const systemGroupsData = await loadRoles();
        setRoles(systemGroupsData);
        console.log('✅ System groups set:', systemGroupsData.length);

        // Load users
        console.log('👥 Loading users...');
        const usersData = await loadUsers();
        setUsers(usersData);
        console.log('✅ Users set:', usersData.length);

        // Set current user based on authenticated user
        if (authUser && usersData.length > 0) {
          const currentUserData = usersData.find(u => u.email === authUser.email);
          if (currentUserData) {
            console.log('✅ Setting current user:', currentUserData.email);
            setCurrentUser(currentUserData);
          } else {
            console.warn('⚠️ Authenticated user not found in users table:', authUser.email);
          }
        }

        // Create permission utilities after both are loaded
        if (systemGroupsData.length > 0) {
          console.log('🔧 Creating permission utilities...');
          createPermissionUtils(usersData, systemGroupsData);
          console.log('✅ Permission utilities created');
        } else {
          console.warn('⚠️ No system groups available for permission utils');
        }

      } catch (error) {
        console.error('❌ Error initializing RBAC data:', error);
        // Don't throw the error, just log it to prevent app crashes
      } finally {
        setLoading(false);
        console.log('✅ RBAC data initialization complete');
      }
    };

    // Only initialize once when auth user is available
    if (authUser && !loading) {
      initializeData();
    }
  }, [authUser?.email]); // Removed other dependencies to prevent multiple initializations

  // Re-create permission utils when system groups change (but not on initial load)
  useEffect(() => {
    if (!loading && roles.length > 0 && users.length > 0) {
      console.log('🔄 System groups changed, updating permission utilities...');
      try {
        createPermissionUtils(users, roles);
      } catch (error) {
        console.error('❌ Error updating permission utilities:', error);
      }
    }
  }, [roles, users, loading]);

  // Set current user when auth user or users data changes
  useEffect(() => {
    if (authUser && users.length > 0 && !loading) {
      const currentUserData = users.find(u => u.email === authUser.email);
      if (currentUserData) {
        console.log('🔄 Updating current user from users data:', currentUserData.email);
        setCurrentUser(currentUserData);
      } else {
        console.error('❌ Current user not found in users data:', authUser.email);
      }
    }
  }, [authUser?.email, users, loading, setCurrentUser]);
};

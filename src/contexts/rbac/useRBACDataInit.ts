
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadUsers, loadRoles } from './dataLoaders';
import { createPermissionUtils } from './permissionUtils';
import { RBACState, RBACActions } from './types';

export const useRBACDataInit = (state: RBACState, actions: RBACActions) => {
  const { loading, users, roles } = state;
  const { setUsers, setRoles, setLoading, setCurrentUser } = actions;
  const { user: authUser } = useAuth();

  useEffect(() => {
    const initializeData = async () => {
      console.log('🚀 Initializing RBAC data...');
      setLoading(true);

      try {
        // Load roles first as they're needed for permission utils
        console.log('📊 Loading roles...');
        const rolesData = await loadRoles();
        setRoles(rolesData);
        console.log('✅ Roles set:', rolesData.length);

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
        if (rolesData.length > 0) {
          console.log('🔧 Creating permission utilities...');
          createPermissionUtils(usersData, rolesData);
          console.log('✅ Permission utilities created');
        } else {
          console.warn('⚠️ No roles available for permission utils');
        }

      } catch (error) {
        console.error('❌ Error initializing RBAC data:', error);
      } finally {
        setLoading(false);
        console.log('✅ RBAC data initialization complete');
      }
    };

    initializeData();
  }, [authUser?.email]); // Include authUser.email in dependencies

  // Re-create permission utils when roles change
  useEffect(() => {
    if (!loading && roles.length > 0) {
      console.log('🔄 Roles changed, updating permission utilities...');
      createPermissionUtils(users, roles);
    }
  }, [roles, users, loading]);

  // Set current user when auth user or users data changes
  useEffect(() => {
    if (authUser && users.length > 0 && !loading) {
      const currentUserData = users.find(u => u.email === authUser.email);
      if (currentUserData) {
        console.log('🔄 Updating current user from users data:', currentUserData.email);
        setCurrentUser(currentUserData);
      }
    }
  }, [authUser?.email, users, loading, setCurrentUser]);
};

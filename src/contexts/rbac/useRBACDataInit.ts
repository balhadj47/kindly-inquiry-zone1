
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RBACState, RBACActions } from './types';
import { loadSystemGroups, loadUsers } from './dataLoaders';
import { createPermissionUtils } from './permissionUtils';

interface UseRBACDataInitProps {
  state: RBACState;
  actions: RBACActions;
}

export const useRBACDataInit = ({ state, actions }: UseRBACDataInitProps) => {
  const { user: authUser } = useAuth();

  useEffect(() => {
    const initializeRBAC = async () => {
      if (!authUser?.email) {
        console.log('🔄 RBAC: No auth user email, skipping initialization');
        actions.setLoading(false);
        return;
      }

      console.log('🚀 Starting optimized RBAC initialization for user:', authUser.email);
      actions.setLoading(true);

      try {
        console.log('📡 Loading system groups and users in parallel...');
        
        // Load both system groups and users in parallel
        const [systemGroups, users] = await Promise.all([
          loadSystemGroups(),
          loadUsers()
        ]);

        console.log('✅ RBAC Data loaded:', {
          systemGroupsCount: systemGroups.length,
          usersCount: users.length,
          authUserEmail: authUser.email
        });

        // Set the data
        actions.setRoles(systemGroups);
        actions.setUsers(users);

        // Find current user by email
        const currentUser = users.find(user => 
          user.email?.toLowerCase() === authUser.email?.toLowerCase()
        );

        if (currentUser) {
          console.log('✅ Current user found:', {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            systemGroup: currentUser.systemGroup
          });
          actions.setCurrentUser(currentUser);
        } else {
          console.warn('⚠️ Current user not found in users list for email:', authUser.email);
          console.log('Available users:', users.map(u => ({ id: u.id, email: u.email })));
          
          // For admin access, let's check if this is a known admin email
          if (authUser.email === 'gb47@msn.com') {
            console.log('🔓 Allowing admin access for known admin email');
            const adminUser = {
              id: 'admin-temp',
              name: 'Administrator',
              email: authUser.email,
              phone: '',
              systemGroup: 'Administrator' as const,
              status: 'Active' as const,
              createdAt: new Date().toISOString(),
              get role() { return this.systemGroup; }
            };
            actions.setCurrentUser(adminUser);
          } else {
            actions.setCurrentUser(null);
          }
        }

        // Initialize permission utilities
        console.log('🔧 Creating permission utils with:', { 
          usersCount: users.length, 
          systemGroupsCount: systemGroups.length 
        });
        createPermissionUtils(users, systemGroups);

      } catch (error) {
        console.error('❌ RBAC initialization error:', error);
        actions.setCurrentUser(null);
      } finally {
        actions.setLoading(false);
        console.log('🏁 RBAC initialization completed');
      }
    };

    initializeRBAC();
  }, [authUser?.email, actions]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('🔄 RBAC State Update:', {
      currentUser: state.currentUser?.id,
      usersCount: state.users.length,
      rolesCount: state.roles.length,
      loading: state.loading
    });
  }, [state.currentUser, state.users.length, state.roles.length, state.loading]);
};

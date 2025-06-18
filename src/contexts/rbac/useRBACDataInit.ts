
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RBACState, RBACActions } from './types';
import { loadRoles, loadUsers } from './dataLoaders';
import { createPermissionUtils } from './permissionUtils';

interface UseRBACDataInitProps {
  state: RBACState;
  actions: RBACActions;
}

export const useRBACDataInit = ({ state, actions }: UseRBACDataInitProps) => {
  const { user: authUser } = useAuth();
  const initializationRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current || !authUser?.email) {
      return;
    }

    const initializeRBAC = async () => {
      console.log('🚀 Starting RBAC initialization for user:', authUser.email);
      initializationRef.current = true;
      actions.setLoading(true);

      try {
        // Load both system groups and users in parallel
        const [systemGroups, users] = await Promise.all([
          loadRoles(),
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
          console.warn('⚠️ Current user not found, checking for admin access');
          
          // For admin access, let's check if this is a known admin email
          if (authUser.email === 'gb47@msn.com') {
            console.log('🔓 Creating admin temp user for known admin email');
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
  }, [authUser?.email]); // Only depend on email to prevent loops

  // Reset initialization flag when user changes
  useEffect(() => {
    if (!authUser?.email) {
      initializationRef.current = false;
    }
  }, [authUser?.email]);
};

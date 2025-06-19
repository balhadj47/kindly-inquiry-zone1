
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
  const { user: authUser, loading: authLoading } = useAuth();
  const initializationRef = useRef(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('⏳ Waiting for auth to finish loading...');
      return;
    }

    // If no user is authenticated, don't initialize RBAC
    if (!authUser) {
      console.log('❌ No authenticated user, skipping RBAC initialization');
      actions.setLoading(false);
      return;
    }

    // Prevent multiple initializations
    if (initializationRef.current) {
      return;
    }

    const initializeRBAC = async () => {
      console.log('🚀 Starting RBAC initialization for user:', authUser?.email);
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
          authUserEmail: authUser?.email
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
          console.log('⚠️ Current user not found in system, creating basic profile');
          // Create a basic user profile for authenticated users not in the system
          const basicUser = {
            id: authUser.id,
            name: authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
            phone: '',
            systemGroup: 'Employee' as const,
            status: 'Active' as const,
            createdAt: new Date().toISOString(),
            get role() { return this.systemGroup; }
          };
          actions.setCurrentUser(basicUser);
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
  }, [authUser?.email, authLoading]);

  // Reset initialization flag when user changes
  useEffect(() => {
    if (!authUser?.email) {
      initializationRef.current = false;
    }
  }, [authUser?.email]);
};

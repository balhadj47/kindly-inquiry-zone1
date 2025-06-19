
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

    // Prevent multiple initializations
    if (initializationRef.current) {
      return;
    }

    const initializeRBAC = async () => {
      console.log('🚀 Starting RBAC initialization for user:', authUser?.email || 'temp-user');
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
          authUserEmail: authUser?.email || 'temp-user'
        });

        // Set the data
        actions.setRoles(systemGroups);
        actions.setUsers(users);

        // Find current user by email or use temp admin
        let currentUser = null;
        
        if (authUser?.email && authUser.email !== 'admin@temp.com') {
          currentUser = users.find(user => 
            user.email?.toLowerCase() === authUser.email?.toLowerCase()
          );
        }

        if (currentUser) {
          console.log('✅ Current user found:', {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            systemGroup: currentUser.systemGroup
          });
          actions.setCurrentUser(currentUser);
        } else {
          console.log('🔓 Creating admin temp user for development');
          const adminUser = {
            id: 'admin-temp',
            name: 'Administrator',
            email: authUser?.email || 'admin@temp.com',
            phone: '',
            systemGroup: 'Administrator' as const,
            status: 'Active' as const,
            createdAt: new Date().toISOString(),
            get role() { return this.systemGroup; }
          };
          actions.setCurrentUser(adminUser);
        }

        // Initialize permission utilities
        createPermissionUtils(users, systemGroups);

      } catch (error) {
        console.error('❌ RBAC initialization error:', error);
        
        // Create fallback admin user even on error
        const fallbackUser = {
          id: 'admin-temp',
          name: 'Administrator',
          email: authUser?.email || 'admin@temp.com',
          phone: '',
          systemGroup: 'Administrator' as const,
          status: 'Active' as const,
          createdAt: new Date().toISOString(),
          get role() { return this.systemGroup; }
        };
        actions.setCurrentUser(fallbackUser);
      } finally {
        actions.setLoading(false);
        console.log('🏁 RBAC initialization completed');
      }
    };

    initializeRBAC();
  }, [authUser?.email, authLoading]); // Include authLoading in dependencies

  // Reset initialization flag when user changes
  useEffect(() => {
    if (!authUser?.email) {
      initializationRef.current = false;
    }
  }, [authUser?.email]);
};

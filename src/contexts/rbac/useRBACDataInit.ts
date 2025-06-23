
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RBACState, RBACActions } from './types';
import { loadRoles } from './dataLoaders';
import { createPermissionUtils } from './permissionUtils';

interface UseRBACDataInitProps {
  state: RBACState;
  actions: RBACActions;
}

// Known admin emails - these will always get Administrator privileges (role_id: 1)
const ADMIN_EMAILS = [
  'gb47@msn.com',
  'admin@example.com'
];

const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Helper function to get role_id from auth user
const getRoleIdFromAuthUser = (authUser: any): number => {
  // First check user metadata for role_id (this should be the primary method now)
  if (authUser.user_metadata?.role_id) {
    console.log('📋 Found role_id in user_metadata:', authUser.user_metadata.role_id);
    return authUser.user_metadata.role_id;
  }
  
  // Fallback to email-based admin detection for existing users without metadata
  if (isAdminEmail(authUser.email || '')) {
    console.log('📋 Admin email detected, assigning role_id: 1');
    return 1; // Administrator
  }
  
  // Default to supervisor for auth users (not employees)
  console.log('📋 Defaulting to supervisor role_id: 2');
  return 2; // Supervisor
};

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
      actions.setCurrentUser(null);
      actions.setLoading(false);
      return;
    }

    // Prevent multiple initializations
    if (initializationRef.current) {
      return;
    }

    const initializeRBAC = async () => {
      console.log('🚀 Starting auth-first RBAC initialization for user:', authUser?.email);
      console.log('🔍 Auth user metadata:', authUser?.user_metadata);
      initializationRef.current = true;
      actions.setLoading(true);

      try {
        // Load only system groups (roles) - no users table needed for auth
        const systemGroups = await loadRoles();

        console.log('✅ RBAC Data loaded:', {
          systemGroupsCount: systemGroups.length,
          authUserEmail: authUser?.email,
          authUserMetadata: authUser?.user_metadata
        });

        // Set the roles data
        actions.setRoles(systemGroups);
        // Don't load users table for authentication - keep it empty for auth purposes
        actions.setUsers([]);

        // Create current user from auth user data
        const roleId = getRoleIdFromAuthUser(authUser);
        
        console.log('🔐 Assigning role_id:', roleId, 'for email:', authUser.email);
        
        // Create user profile from auth user
        const currentUser = {
          id: authUser.id,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          phone: authUser.user_metadata?.phone || '',
          role_id: roleId,
          status: 'Active' as const,
          createdAt: new Date().toISOString(),
        };

        actions.setCurrentUser(currentUser);

        // Initialize permission utilities with empty users array and current user
        createPermissionUtils([currentUser], systemGroups);

        console.log('✅ Auth-first RBAC initialized with user:', {
          id: currentUser.id,
          email: currentUser.email,
          role_id: currentUser.role_id,
          metadata_role_id: authUser.user_metadata?.role_id,
          fallback_used: !authUser.user_metadata?.role_id
        });

      } catch (error) {
        console.error('❌ RBAC initialization error:', error);
        actions.setCurrentUser(null);
      } finally {
        actions.setLoading(false);
        console.log('🏁 Auth-first RBAC initialization completed');
      }
    };

    initializeRBAC();
  }, [authUser?.email, authUser?.id, authUser?.user_metadata?.role_id, authLoading]);

  // Reset initialization flag when user changes
  useEffect(() => {
    if (!authUser?.email) {
      initializationRef.current = false;
    }
  }, [authUser?.email]);
};


import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RBACState, RBACActions } from './types';
import { loadRoles } from './dataLoaders';
import { createPermissionUtils } from './permissionUtils';

interface UseRBACDataInitProps {
  state: RBACState;
  actions: RBACActions;
  rolesLoaded?: boolean;
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

export const useRBACDataInit = ({ state, actions, rolesLoaded }: UseRBACDataInitProps) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const initializationRef = useRef(false);

  useEffect(() => {
    // Wait for auth to finish loading and roles to be loaded
    if (authLoading || !rolesLoaded) {
      console.log('⏳ Waiting for auth and roles to finish loading...', { authLoading, rolesLoaded });
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
      console.log('🚀 Starting database-driven RBAC initialization for user:', authUser?.email);
      console.log('🔍 Auth user metadata:', authUser?.user_metadata);
      initializationRef.current = true;
      actions.setLoading(true);

      try {
        // Load system groups (roles) from database with their permissions
        console.log('📋 Loading system groups from database...');
        const systemGroups = await loadRoles();

        if (!systemGroups || systemGroups.length === 0) {
          throw new Error('No system groups loaded from database');
        }

        console.log('✅ RBAC Data loaded from database:', {
          systemGroupsCount: systemGroups.length,
          authUserEmail: authUser?.email,
          authUserMetadata: authUser?.user_metadata,
          systemGroups: systemGroups.map(g => ({ 
            name: g.name, 
            role_id: (g as any).role_id, 
            permissionsCount: g.permissions.length 
          }))
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

        // Initialize permission utilities with current user and database groups
        console.log('🔧 Creating permission utils with database groups...');
        createPermissionUtils([currentUser], systemGroups);

        console.log('✅ Database-driven RBAC initialized with user:', {
          id: currentUser.id,
          email: currentUser.email,
          role_id: currentUser.role_id,
          metadata_role_id: authUser.user_metadata?.role_id,
          fallback_used: !authUser.user_metadata?.role_id,
          systemGroupsLoaded: systemGroups.length
        });

      } catch (error) {
        console.error('❌ Database RBAC initialization error:', error);
        actions.setCurrentUser(null);
      } finally {
        actions.setLoading(false);
        console.log('🏁 Database-driven RBAC initialization completed');
      }
    };

    initializeRBAC();
  }, [authUser?.email, authUser?.id, authUser?.user_metadata?.role_id, authLoading, rolesLoaded]);

  // Reset initialization flag when user changes
  useEffect(() => {
    if (!authUser?.email) {
      initializationRef.current = false;
    }
  }, [authUser?.email]);
};

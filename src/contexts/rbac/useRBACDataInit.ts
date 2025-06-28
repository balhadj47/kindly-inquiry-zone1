import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadRoles } from './dataLoaders';
import { createPermissionUtils } from './permissionUtils';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

interface UseRBACDataInitProps {
  currentUser: User | null;
  users: User[];
  roles: SystemGroup[];
  permissions: string[];
  loading: boolean;
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[] | ((prev: User[]) => User[])) => void;
  setRoles: (roles: SystemGroup[] | ((prev: SystemGroup[]) => SystemGroup[])) => void;
  setPermissions: (permissions: string[] | ((prev: string[]) => string[])) => void;
  setLoading: (loading: boolean) => void;
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
  
  // Default to role_id: 1 for auth users (since role_id: 3 might not exist)
  console.log('📋 Defaulting to admin role_id: 1 for auth users');
  return 1; // Administrator as default for auth users
};

export const useRBACDataInit = ({ 
  currentUser, 
  users, 
  roles, 
  permissions, 
  loading,
  setCurrentUser,
  setUsers,
  setRoles,
  setPermissions,
  setLoading,
  rolesLoaded 
}: UseRBACDataInitProps) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const initializationRef = useRef(false);

  useEffect(() => {
    // Wait for auth to finish loading and roles to be loaded
    if (authLoading || !rolesLoaded) {
      console.log('⏳ useRBACDataInit: Waiting for auth and roles...', { 
        authLoading, 
        rolesLoaded,
        authUser: authUser?.email || 'null'
      });
      return;
    }

    // If no user is authenticated, don't initialize RBAC
    if (!authUser) {
      console.log('❌ useRBACDataInit: No authenticated user, skipping RBAC initialization');
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    // Prevent multiple initializations
    if (initializationRef.current) {
      console.log('🔄 useRBACDataInit: Already initialized, skipping...');
      return;
    }

    const initializeRBAC = async () => {
      console.log('🚀 useRBACDataInit: Starting database-driven RBAC initialization for user:', authUser?.email);
      console.log('🔍 useRBACDataInit: Auth user metadata:', authUser?.user_metadata);
      initializationRef.current = true;
      setLoading(true);

      try {
        // Load system groups (roles) from database with their permissions
        console.log('📋 useRBACDataInit: Loading system groups from database...');
        const systemGroups = await loadRoles();

        console.log('📋 useRBACDataInit: Roles loaded from database:', {
          count: systemGroups.length,
          roles: systemGroups.map(g => ({ 
            name: g.name, 
            role_id: (g as any).role_id, 
            id: g.id,
            permissionsCount: g.permissions.length 
          }))
        });

        if (!systemGroups || systemGroups.length === 0) {
          console.error('⚠️ useRBACDataInit: No system groups loaded from database!');
          console.error('⚠️ useRBACDataInit: This will cause role resolution issues');
          console.error('⚠️ useRBACDataInit: Please check your user_groups table in the database');
        }

        // Set the roles data
        console.log('📋 useRBACDataInit: Setting roles in context...');
        setRoles(systemGroups);
        
        // Don't load users table for authentication - keep it empty for auth purposes
        setUsers([]);

        // Create current user from auth user data
        let roleId = getRoleIdFromAuthUser(authUser);
        
        console.log('🔐 useRBACDataInit: Initial role_id assignment:', roleId, 'for email:', authUser.email);
        
        // Verify the role exists in the database
        const roleExists = systemGroups.some(role => (role as any).role_id === roleId);
        console.log('🔐 useRBACDataInit: Role exists check:', {
          roleId,
          roleExists,
          availableRoles: systemGroups.map(r => ({ name: r.name, role_id: (r as any).role_id }))
        });
        
        if (!roleExists && systemGroups.length > 0) {
          console.warn(`⚠️ useRBACDataInit: Role ${roleId} not found in database!`);
          console.warn('⚠️ useRBACDataInit: Available roles:', 
            systemGroups.map(r => ({ name: r.name, role_id: (r as any).role_id }))
          );
          // Use the first available role as fallback
          const fallbackRoleId = (systemGroups[0] as any).role_id;
          console.log(`🔄 useRBACDataInit: Using fallback role_id: ${fallbackRoleId}`);
          roleId = fallbackRoleId;
        }
        
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

        console.log('👤 useRBACDataInit: Created current user profile:', currentUser);
        setCurrentUser(currentUser);

        // Initialize permission utilities with current user and database groups
        console.log('🔧 useRBACDataInit: Creating permission utils with database groups...');
        createPermissionUtils([currentUser], systemGroups);

        console.log('✅ useRBACDataInit: Database-driven RBAC initialized successfully:', {
          userId: currentUser.id,
          email: currentUser.email,
          role_id: currentUser.role_id,
          metadata_role_id: authUser.user_metadata?.role_id,
          fallback_used: !authUser.user_metadata?.role_id,
          systemGroupsLoaded: systemGroups.length,
          finalRoleAssigned: roleId
        });

      } catch (error) {
        console.error('❌ useRBACDataInit: Database RBAC initialization error:', {
          error: error?.message || error,
          stack: error?.stack,
          authUser: authUser?.email
        });
        setCurrentUser(null);
      } finally {
        setLoading(false);
        console.log('🏁 useRBACDataInit: Database-driven RBAC initialization completed');
      }
    };

    initializeRBAC();
  }, [authUser?.email, authUser?.id, authUser?.user_metadata?.role_id, authLoading, rolesLoaded]);

  // Reset initialization flag when user changes
  useEffect(() => {
    if (!authUser?.email) {
      console.log('🔄 useRBACDataInit: Auth user changed, resetting initialization flag');
      initializationRef.current = false;
    }
  }, [authUser?.email]);
};

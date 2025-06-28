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
      console.log('⏳ Waiting for auth and roles to finish loading...', { authLoading, rolesLoaded });
      return;
    }

    // If no user is authenticated, don't initialize RBAC
    if (!authUser) {
      console.log('❌ No authenticated user, skipping RBAC initialization');
      setCurrentUser(null);
      setLoading(false);
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
      setLoading(true);

      try {
        // Load system groups (roles) from database with their permissions
        console.log('📋 Loading system groups from database...');
        const systemGroups = await loadRoles();

        if (!systemGroups || systemGroups.length === 0) {
          console.error('⚠️ No system groups loaded from database - this might cause role resolution issues');
          // Continue anyway, but log the warning
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
        setRoles(systemGroups);
        // Don't load users table for authentication - keep it empty for auth purposes
        setUsers([]);

        // Create current user from auth user data
        const roleId = getRoleIdFromAuthUser(authUser);
        
        console.log('🔐 Assigning role_id:', roleId, 'for email:', authUser.email);
        
        // Verify the role exists in the database
        const roleExists = systemGroups.some(role => (role as any).role_id === roleId);
        if (!roleExists && systemGroups.length > 0) {
          console.warn(`⚠️ Role ${roleId} not found in database. Available roles:`, 
            systemGroups.map(r => ({ name: r.name, role_id: (r as any).role_id }))
          );
          // Use the first available role as fallback
          const fallbackRoleId = (systemGroups[0] as any).role_id;
          console.log(`🔄 Using fallback role_id: ${fallbackRoleId}`);
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

        setCurrentUser(currentUser);

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
        setCurrentUser(null);
      } finally {
        setLoading(false);
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


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

// Helper function to get role_id from auth user with better metadata handling
const getRoleIdFromAuthUser = (authUser: any): number => {
  console.log('🔍 getRoleIdFromAuthUser: Full auth user object:', authUser);
  console.log('🔍 getRoleIdFromAuthUser: user_metadata:', authUser.user_metadata);
  console.log('🔍 getRoleIdFromAuthUser: app_metadata:', authUser.app_metadata);
  
  // Check multiple possible locations for role_id
  const possibleRoleId = 
    authUser.user_metadata?.role_id || 
    authUser.app_metadata?.role_id ||
    authUser.role_id ||
    authUser.user_metadata?.role ||
    authUser.app_metadata?.role;
  
  console.log('🔍 getRoleIdFromAuthUser: Found possible role_id:', possibleRoleId);
  
  // If we found a role_id, use it (convert to number if needed)
  if (possibleRoleId !== undefined && possibleRoleId !== null) {
    const roleId = typeof possibleRoleId === 'string' ? parseInt(possibleRoleId) : possibleRoleId;
    console.log('📋 Found role_id in metadata:', roleId);
    return roleId;
  }
  
  // Fallback to email-based admin detection
  if (isAdminEmail(authUser.email || '')) {
    console.log('📋 Admin email detected, assigning role_id: 1');
    return 1; // Administrator
  }
  
  // Default to supervisor role for authenticated users
  console.log('📋 No role_id found, defaulting to supervisor role_id: 2');
  return 2; // Supervisor as default for auth users
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
      console.log('🚀 useRBACDataInit: Starting auth-based RBAC initialization for user:', authUser?.email);
      console.log('🔍 useRBACDataInit: Auth user full object:', authUser);
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
            permissionsCount: g.permissions.length,
            accessiblePages: g.accessiblePages?.length || 0
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

        // Create current user from auth user data with improved role detection
        let roleId = getRoleIdFromAuthUser(authUser);
        
        console.log('🔐 useRBACDataInit: Initial role_id assignment:', roleId, 'for email:', authUser.email);
        
        // Verify the role exists in the database
        const roleExists = systemGroups.some(role => (role as any).role_id === roleId);
        const assignedRole = systemGroups.find(role => (role as any).role_id === roleId);
        
        console.log('🔐 useRBACDataInit: Role exists check:', {
          roleId,
          roleExists,
          assignedRole: assignedRole ? {
            name: assignedRole.name,
            permissions: assignedRole.permissions,
            accessiblePages: assignedRole.accessiblePages
          } : null,
          availableRoles: systemGroups.map(r => ({ name: r.name, role_id: (r as any).role_id }))
        });
        
        if (!roleExists && systemGroups.length > 0) {
          console.warn(`⚠️ useRBACDataInit: Role ${roleId} not found in database!`);
          console.warn('⚠️ useRBACDataInit: Available roles:', 
            systemGroups.map(r => ({ name: r.name, role_id: (r as any).role_id }))
          );
          // Find a suitable fallback role (prefer supervisor over admin)
          const supervisorRole = systemGroups.find(r => (r as any).role_id === 2);
          const fallbackRoleId = supervisorRole ? 2 : (systemGroups[0] as any).role_id;
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

        // Log detailed role and permission information
        const finalRole = systemGroups.find(role => (role as any).role_id === roleId);
        if (finalRole) {
          console.log('🎯 useRBACDataInit: Final user role details:', {
            roleName: finalRole.name,
            permissions: finalRole.permissions,
            accessiblePages: finalRole.accessiblePages,
            permissionsCount: finalRole.permissions.length,
            pagesCount: finalRole.accessiblePages?.length || 0
          });
        }

        console.log('✅ useRBACDataInit: Auth-based RBAC initialized successfully:', {
          userId: currentUser.id,
          email: currentUser.email,
          role_id: currentUser.role_id,
          roleName: finalRole?.name,
          metadata_role_id: authUser.user_metadata?.role_id,
          app_metadata_role_id: authUser.app_metadata?.role_id,
          systemGroupsLoaded: systemGroups.length,
          finalRoleAssigned: roleId,
          userPermissions: finalRole?.permissions || [],
          userAccessiblePages: finalRole?.accessiblePages || []
        });

      } catch (error) {
        console.error('❌ useRBACDataInit: Auth-based RBAC initialization error:', {
          error: error?.message || error,
          stack: error?.stack,
          authUser: authUser?.email
        });
        setCurrentUser(null);
      } finally {
        setLoading(false);
        console.log('🏁 useRBACDataInit: Auth-based RBAC initialization completed');
      }
    };

    initializeRBAC();
  }, [authUser?.email, authUser?.id, authUser?.user_metadata, authUser?.app_metadata, authLoading, rolesLoaded]);

  // Reset initialization flag when user changes
  useEffect(() => {
    if (!authUser?.email) {
      console.log('🔄 useRBACDataInit: Auth user changed, resetting initialization flag');
      initializationRef.current = false;
    }
  }, [authUser?.email]);
};

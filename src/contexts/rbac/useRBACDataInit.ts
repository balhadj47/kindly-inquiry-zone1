
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

// Known admin emails - these will always get Administrator privileges
const ADMIN_EMAILS = [
  'gb47@msn.com',
  'admin@example.com'
];

const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Helper function to get role_id from auth user with better metadata handling
const getRoleIdFromAuthUser = (authUser: any, availableRoles: SystemGroup[]): number | null => {
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
  
  // If we found a role_id, validate it exists in available roles
  if (possibleRoleId !== undefined && possibleRoleId !== null) {
    const roleId = typeof possibleRoleId === 'string' ? parseInt(possibleRoleId) : possibleRoleId;
    const roleExists = availableRoles.some(role => (role as any).role_id === roleId);
    if (roleExists) {
      console.log('📋 Found valid role_id in metadata:', roleId);
      return roleId;
    }
    console.log('⚠️ Role_id from metadata not found in available roles:', roleId);
  }
  
  // Fallback to admin detection
  if (isAdminEmail(authUser.email || '')) {
    // Find admin role dynamically
    const adminRole = availableRoles.find(role => 
      role.name.toLowerCase().includes('admin') || 
      role.name.toLowerCase().includes('administrator')
    );
    if (adminRole) {
      console.log('📋 Admin email detected, using admin role_id:', (adminRole as any).role_id);
      return (adminRole as any).role_id;
    }
  }
  
  // No valid role found
  console.log('📋 No valid role_id found, will use default from available roles');
  return null;
};

// Helper to get default role from available roles
const getDefaultRoleId = (availableRoles: SystemGroup[]): number | null => {
  if (!availableRoles || availableRoles.length === 0) {
    console.warn('⚠️ No available roles to choose default from');
    return null;
  }

  // Priority order: look for common role names
  const rolePriority = ['utilisateur', 'user', 'employee', 'employe', 'supervisor', 'admin'];
  
  for (const priority of rolePriority) {
    const role = availableRoles.find(r => 
      r.name.toLowerCase().includes(priority)
    );
    if (role) {
      console.log('📋 Using default role:', role.name, 'with role_id:', (role as any).role_id);
      return (role as any).role_id;
    }
  }
  
  // If no priority match, use first available role
  const firstRole = availableRoles[0];
  console.log('📋 Using first available role as default:', firstRole.name, 'with role_id:', (firstRole as any).role_id);
  return (firstRole as any).role_id;
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

        // Create current user from auth user data with dynamic role detection
        let roleId = getRoleIdFromAuthUser(authUser, systemGroups);
        
        // If no role found in metadata, use default
        if (roleId === null) {
          roleId = getDefaultRoleId(systemGroups);
        }
        
        console.log('🔐 useRBACDataInit: Final role_id assignment:', roleId, 'for email:', authUser.email);
        
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

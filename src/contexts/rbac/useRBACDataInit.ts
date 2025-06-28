
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

const isAdminByPermissions = (userRole: SystemGroup): boolean => {
  if (!userRole || !userRole.permissions) return false;
  return userRole.permissions.length >= 10;
};

const getRoleIdFromAuthUser = (authUser: any, availableRoles: SystemGroup[]): number | null => {
  console.log('🔍 getRoleIdFromAuthUser: Checking metadata for role_id');
  
  const possibleRoleId = 
    authUser.user_metadata?.role_id || 
    authUser.app_metadata?.role_id ||
    authUser.role_id;
  
  if (possibleRoleId !== undefined && possibleRoleId !== null) {
    const roleId = typeof possibleRoleId === 'string' ? parseInt(possibleRoleId) : possibleRoleId;
    const roleExists = availableRoles.some(role => (role as any).role_id === roleId);
    if (roleExists) {
      console.log('📋 Found valid role_id in metadata:', roleId);
      return roleId;
    }
  }
  
  // Default to role with highest permissions for admin users
  const adminRole = availableRoles
    .filter(role => role.permissions && role.permissions.length > 0)
    .sort((a, b) => b.permissions.length - a.permissions.length)[0];
  
  if (adminRole && isAdminByPermissions(adminRole)) {
    console.log('📋 Using admin role by default:', (adminRole as any).role_id);
    return (adminRole as any).role_id;
  }
  
  return null;
};

const getDefaultRoleId = (availableRoles: SystemGroup[]): number | null => {
  if (!availableRoles || availableRoles.length === 0) {
    return null;
  }

  // Use role with least permissions as default
  const sortedRoles = availableRoles
    .filter(role => role.permissions && Array.isArray(role.permissions))
    .sort((a, b) => a.permissions.length - b.permissions.length);
  
  if (sortedRoles.length > 0) {
    const defaultRole = sortedRoles[0];
    console.log('📋 Using default role:', defaultRole.name, 'role_id:', (defaultRole as any).role_id);
    return (defaultRole as any).role_id;
  }
  
  return availableRoles[0] ? (availableRoles[0] as any).role_id : null;
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
    if (authLoading || !rolesLoaded) {
      console.log('⏳ useRBACDataInit: Waiting for auth and roles...');
      return;
    }

    if (!authUser) {
      console.log('❌ useRBACDataInit: No authenticated user');
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    if (initializationRef.current) {
      console.log('🔄 useRBACDataInit: Already initialized');
      return;
    }

    const initializeRBAC = async () => {
      console.log('🚀 useRBACDataInit: Starting initialization for user:', authUser?.email);
      initializationRef.current = true;
      setLoading(true);

      try {
        console.log('📋 useRBACDataInit: Loading system groups...');
        const systemGroups = await loadRoles();

        if (!systemGroups || systemGroups.length === 0) {
          console.error('⚠️ useRBACDataInit: No system groups loaded!');
          setRoles([]);
          setUsers([]);
          setCurrentUser(null);
          return;
        }

        console.log('📋 useRBACDataInit: Setting roles in context...');
        setRoles(systemGroups);
        setUsers([]);

        // Create current user with proper role assignment
        let roleId = getRoleIdFromAuthUser(authUser, systemGroups);
        
        if (roleId === null) {
          roleId = getDefaultRoleId(systemGroups);
        }
        
        const roleExists = systemGroups.some(role => (role as any).role_id === roleId);
        const assignedRole = systemGroups.find(role => (role as any).role_id === roleId);
        
        if (!roleExists && systemGroups.length > 0) {
          console.warn(`⚠️ Role ${roleId} not found, using fallback`);
          roleId = (systemGroups[0] as any).role_id;
        }
        
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

        createPermissionUtils([currentUser], systemGroups);

        const finalRole = systemGroups.find(role => (role as any).role_id === roleId);
        console.log('✅ useRBACDataInit: Initialization complete:', {
          userId: currentUser.id,
          email: currentUser.email,
          role_id: currentUser.role_id,
          roleName: finalRole?.name,
          permissions: finalRole?.permissions?.length || 0,
          pages: finalRole?.accessiblePages?.length || 0
        });

      } catch (error) {
        console.error('❌ useRBACDataInit: Initialization error:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeRBAC();
  }, [authUser?.email, authUser?.id, authLoading, rolesLoaded]);

  useEffect(() => {
    if (!authUser?.email) {
      initializationRef.current = false;
    }
  }, [authUser?.email]);
};


import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

/**
 * SECURE PERMISSIONS HOOK - Database-first, no client-side logic
 * All permission checks go through secure database functions
 */
export const useSecurePermissions = () => {
  const { user: authUser } = useAuth();

  // Real-time user data check via database
  const { data: currentUser = null } = useQuery({
    queryKey: ['secure-current-user', authUser?.id],
    queryFn: async () => {
      if (!authUser) return null;
      
      const { data, error } = await supabase.rpc('get_current_user_rbac');
      if (error) {
        console.error('Error fetching current user RBAC:', error);
        return null;
      }
      console.log('🔒 Current user RBAC data:', data);
      return data;
    },
    enabled: !!authUser,
    staleTime: 30000,
    gcTime: 60000,
  });

  // Real-time admin status check via database
  const { data: isAdmin = false } = useQuery({
    queryKey: ['secure-admin-status', authUser?.id],
    queryFn: async () => {
      if (!authUser || !currentUser) return false;
      
      const { data, error } = await supabase.rpc('current_user_is_admin');
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      console.log('🔒 Admin status:', data);
      return data === true;
    },
    enabled: !!authUser && !!currentUser,
    staleTime: 30000,
    gcTime: 60000,
  });

  // Real-time permissions check via database
  const { data: userPermissions = [] } = useQuery({
    queryKey: ['secure-permissions', authUser?.id, currentUser?.role_id],
    queryFn: async () => {
      if (!authUser || !currentUser) return [];
      
      const { data, error } = await supabase.rpc('get_current_user_permissions');
      if (error) {
        console.error('Error fetching permissions:', error);
        return [];
      }
      console.log('🔒 User permissions:', data);
      return data || [];
    },
    enabled: !!authUser && !!currentUser,
    staleTime: 30000,
    gcTime: 60000,
  });

  // Secure permission checker - always hits database
  const checkPermission = async (permission: string): Promise<boolean> => {
    if (!authUser) return false;

    try {
      const { data, error } = await supabase.rpc('current_user_has_permission', {
        permission_name: permission
      });

      if (error) {
        console.error('Error checking permission:', permission, error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Exception checking permission:', permission, error);
      return false;
    }
  };

  // Synchronous permission checker (uses database query data only)
  const hasPermission = (permission: string): boolean => {
    if (!authUser || !currentUser) {
      return false;
    }
    
    // STRICT: Only return true if permission is explicitly found
    const hasDirectPermission = Array.isArray(userPermissions) && userPermissions.includes(permission);
    console.log(`🔒 Permission check: ${permission} = ${hasDirectPermission}`, {
      userPermissions,
      roleId: currentUser.role_id,
      isViewOnly: currentUser.role_id === 2
    });
    return hasDirectPermission;
  };

  // Helper to check if user is view-only (role_id = 2)
  const isViewOnly = currentUser?.role_id === 2;

  const permissions = {
    isAuthenticated: !!authUser,
    isAdmin,
    isViewOnly,
    checkPermission,
    hasPermission,
    currentUser,
    // Specific secure permission helpers - STRICT checking
    canReadCompanies: hasPermission('companies:read'),
    canCreateCompanies: hasPermission('companies:create'),
    canUpdateCompanies: hasPermission('companies:update'),
    canDeleteCompanies: hasPermission('companies:delete'),
    canReadVans: hasPermission('vans:read'),
    canCreateVans: hasPermission('vans:create'),
    canUpdateVans: hasPermission('vans:update'),
    canDeleteVans: hasPermission('vans:delete'),
    canReadUsers: hasPermission('users:read'),
    canCreateUsers: hasPermission('users:create'),
    canUpdateUsers: hasPermission('users:update'),
    canDeleteUsers: hasPermission('users:delete'),
    canReadTrips: hasPermission('trips:read'),
    canCreateTrips: hasPermission('trips:create'),
    canUpdateTrips: hasPermission('trips:update'),
    canDeleteTriips: hasPermission('trips:delete'),
    canReadAuthUsers: hasPermission('auth-users:read'),
    canAccessDashboard: hasPermission('dashboard:read'),
  };

  return permissions;
};

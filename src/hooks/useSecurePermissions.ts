
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

/**
 * SECURE PERMISSIONS HOOK - Database-first, no client-side logic
 * All permission checks go through secure database functions
 */
export const useSecurePermissions = () => {
  const { user: authUser } = useAuth();

  // Real-time admin status check via database
  const { data: isAdmin = false } = useQuery({
    queryKey: ['secure-admin-status', authUser?.id],
    queryFn: async () => {
      if (!authUser) return false;
      
      const { data, error } = await supabase.rpc('current_user_is_admin');
      if (error) {
        return false;
      }
      return data === true;
    },
    enabled: !!authUser,
    staleTime: 30000,
    gcTime: 60000,
  });

  // Real-time user data check via database
  const { data: currentUser = null } = useQuery({
    queryKey: ['secure-current-user', authUser?.id],
    queryFn: async () => {
      if (!authUser) return null;
      
      const { data, error } = await supabase.rpc('get_current_user_rbac');
      if (error) {
        return null;
      }
      return data;
    },
    enabled: !!authUser,
    staleTime: 30000,
    gcTime: 60000,
  });

  // Real-time permissions check via database
  const { data: userPermissions = [] } = useQuery({
    queryKey: ['secure-permissions', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      
      const { data, error } = await supabase.rpc('get_current_user_permissions');
      if (error) {
        return [];
      }
      return data || [];
    },
    enabled: !!authUser,
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
        return false;
      }

      return data === true;
    } catch (error) {
      return false;
    }
  };

  // Synchronous permission checker (uses database query data only)
  const hasPermission = (permission: string): boolean => {
    if (!authUser) {
      return false;
    }
    
    // Use the permissions from database query (already handles null role_id)
    const hasDirectPermission = userPermissions.includes(permission);
    if (hasDirectPermission) {
      return true;
    }
    
    return false;
  };

  const permissions = {
    isAuthenticated: !!authUser,
    isAdmin,
    checkPermission,
    hasPermission,
    currentUser,
    // Specific secure permission helpers
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
    canDeleteTrips: hasPermission('trips:delete'),
    canReadAuthUsers: hasPermission('auth-users:read'),
    canAccessDashboard: hasPermission('dashboard:read'),
  };

  return permissions;
};

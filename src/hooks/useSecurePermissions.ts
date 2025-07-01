
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
        console.error('❌ Admin check failed:', error);
        return false;
      }
      return data === true;
    },
    enabled: !!authUser,
    staleTime: 0, // Always fetch fresh data for security
    gcTime: 0, // No caching for security-critical data
  });

  // Real-time permissions check via database
  const { data: userPermissions = [] } = useQuery({
    queryKey: ['secure-permissions', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      
      const { data, error } = await supabase.rpc('get_current_user_permissions');
      if (error) {
        console.error('❌ Permissions fetch failed:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!authUser,
    staleTime: 0, // Always fetch fresh data for security
    gcTime: 0, // No caching for security-critical data
  });

  // Secure permission checker - always hits database
  const checkPermission = async (permission: string): Promise<boolean> => {
    if (!authUser) return false;

    try {
      const { data, error } = await supabase.rpc('current_user_has_permission', {
        permission_name: permission
      });

      if (error) {
        console.error('❌ Permission check failed:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('❌ Permission check exception:', error);
      return false;
    }
  };

  // Synchronous permission checker (uses fresh query data only)
  const hasPermission = (permission: string): boolean => {
    if (!authUser) return false;
    if (isAdmin) return true; // Admin has all permissions
    return userPermissions.includes(permission);
  };

  return {
    isAuthenticated: !!authUser,
    isAdmin,
    checkPermission,
    hasPermission,
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
};

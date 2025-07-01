
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Cache for database permission checks
const permissionCache = new Map<string, boolean>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const usePermissions = () => {
  const { user: authUser } = useAuth();
  const { currentUser, roles } = useRBAC();

  // Query to get user permissions from secure database functions
  const { data: dbPermissions = [] } = useQuery({
    queryKey: ['user-permissions', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      
      try {
        const { data, error } = await supabase.rpc('get_current_user_permissions');
        
        if (error) {
          console.error('❌ Error fetching user permissions:', error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error('❌ Exception fetching user permissions:', error);
        return [];
      }
    },
    enabled: !!authUser,
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION,
  });

  // Check if user is admin using secure database function
  const { data: isAdmin = false } = useQuery({
    queryKey: ['user-is-admin', authUser?.id],
    queryFn: async () => {
      if (!authUser) return false;
      
      try {
        const { data, error } = await supabase.rpc('current_user_is_admin');
        
        if (error) {
          console.error('❌ Error checking admin status:', error);
          return false;
        }
        
        return data === true;
      } catch (error) {
        console.error('❌ Exception checking admin status:', error);
        return false;
      }
    },
    enabled: !!authUser,
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION,
  });

  // Database-first permission checker using secure functions
  const checkPermission = async (permission: string): Promise<boolean> => {
    // If no auth user, deny access
    if (!authUser) return false;

    // Check cache first
    const cacheKey = `${authUser.id}:${permission}`;
    const cachedResult = permissionCache.get(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    try {
      // Use secure database function for permission check
      const { data, error } = await supabase.rpc('current_user_has_permission', {
        permission_name: permission
      });

      if (error) {
        console.warn('⚠️ Database permission check failed:', error);
        return false;
      }

      // Cache the result
      permissionCache.set(cacheKey, data);
      setTimeout(() => permissionCache.delete(cacheKey), CACHE_DURATION);
      
      return data === true;
    } catch (error) {
      console.warn('⚠️ Database permission check exception:', error);
      return false;
    }
  };

  // Synchronous permission checker (uses cache and fallbacks)
  const hasPermission = (permission: string): boolean => {
    if (!authUser) return false;

    // Admin users have all permissions
    if (isAdmin) return true;

    // Check cache first
    const cacheKey = `${authUser.id}:${permission}`;
    const cachedResult = permissionCache.get(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    // Check if permission is in the cached permissions from query
    return dbPermissions.includes(permission);
  };

  return {
    isAuthenticated: !!authUser,
    isHighPrivilegeUser: isAdmin,
    isAdmin,
    checkPermission,
    hasPermission,
    // Specific permission helpers using secure database functions
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


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

  // Query to get user permissions from database
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
    cacheTime: CACHE_DURATION,
  });

  // Simple helper to check if user is high privilege (admin/supervisor)
  const isHighPrivilegeUser = (): boolean => {
    if (!currentUser?.role_id || !roles) return false;
    
    const userRole = roles.find(role => (role as any).role_id === currentUser.role_id);
    if (!userRole) return false;
    
    // High privilege users have many permissions (10+)
    return userRole.permissions.length >= 10;
  };

  // Database-first permission checker with fallbacks
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
      // Use database function for permission check
      const { data, error } = await supabase.rpc('current_user_has_permission', {
        permission_name: permission
      });

      if (error) {
        console.warn('⚠️ Database permission check failed, using fallback:', error);
        // Fallback to local role-based check
        return fallbackPermissionCheck(permission);
      }

      // Cache the result
      permissionCache.set(cacheKey, data);
      setTimeout(() => permissionCache.delete(cacheKey), CACHE_DURATION);
      
      return data;
    } catch (error) {
      console.warn('⚠️ Database permission check exception, using fallback:', error);
      return fallbackPermissionCheck(permission);
    }
  };

  // Fallback permission check using local role data
  const fallbackPermissionCheck = (permission: string): boolean => {
    // High privilege user bypass
    if (isHighPrivilegeUser()) return true;

    // Check if permission is in the cached permissions from query
    if (dbPermissions.includes(permission)) return true;

    // Default deny
    return false;
  };

  // Synchronous permission checker (uses cache and fallbacks)
  const hasPermission = (permission: string): boolean => {
    if (!authUser) return false;

    // Check cache first
    const cacheKey = `${authUser.id}:${permission}`;
    const cachedResult = permissionCache.get(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    // Use fallback for immediate response
    return fallbackPermissionCheck(permission);
  };

  return {
    isAuthenticated: !!authUser,
    isHighPrivilegeUser: isHighPrivilegeUser(),
    checkPermission,
    hasPermission,
    // Specific permission helpers using database functions
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

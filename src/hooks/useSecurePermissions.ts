
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
  const { data: currentUser = null, error: currentUserError } = useQuery({
    queryKey: ['secure-current-user', authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) {
        console.log('🔒 No auth user ID, skipping current user query');
        return null;
      }
      
      try {
        // Fetch user data directly from users table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', authUser.id)
          .single();
        
        if (error) {
          console.error('🔴 Error fetching current user:', error);
          return null;
        }
        console.log('🔒 Current user data:', data);
        console.log('🔒 Current user role_id specifically:', data?.role_id);
        console.log('🔒 Current user role_id type:', typeof data?.role_id);
        return data;
      } catch (err) {
        console.error('🔴 Exception in currentUser query:', err);
        return null;
      }
    },
    enabled: !!authUser?.id,
    staleTime: 30000,
    gcTime: 60000,
    retry: (failureCount, error) => {
      console.error(`🔴 CurrentUser query retry ${failureCount}:`, error);
      return failureCount < 2;
    }
  });

  // Log currentUser query errors
  if (currentUserError) {
    console.error('🔴 CurrentUser query error:', currentUserError);
  }

  // Real-time admin status check via database
  const { data: isAdmin = false, error: adminError } = useQuery({
    queryKey: ['secure-admin-status', authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) {
        console.log('🔒 No auth user ID, skipping admin status query');
        return false;
      }
      
      try {
        const { data, error } = await supabase.rpc('current_user_is_admin');
        if (error) {
          console.error('🔴 Error checking admin status:', error);
          return false;
        }
        console.log('🔒 Admin status:', data);
        return data === true;
      } catch (err) {
        console.error('🔴 Exception in admin status check:', err);
        return false;
      }
    },
    enabled: !!authUser?.id,
    staleTime: 30000,
    gcTime: 60000,
    retry: (failureCount, error) => {
      console.error(`🔴 Admin status query retry ${failureCount}:`, error);
      return failureCount < 2;
    }
  });

  // Log admin query errors
  if (adminError) {
    console.error('🔴 Admin status query error:', adminError);
  }

  // Real-time permissions check via database
  const { data: userPermissions = [], error: permissionsError } = useQuery({
    queryKey: ['secure-permissions', authUser?.id, currentUser?.role_id],
    queryFn: async () => {
      if (!authUser?.id) {
        console.log('🔒 No auth user ID, skipping permissions query');
        return [];
      }
      
      try {
        const { data, error } = await supabase.rpc('get_current_user_permissions');
        if (error) {
          console.error('🔴 Error fetching permissions:', error);
          return [];
        }
        console.log('🔒 User permissions:', data);
        console.log('🔒 User permissions type:', typeof data, Array.isArray(data));
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.error('🔴 Exception in permissions query:', err);
        return [];
      }
    },
    enabled: !!authUser?.id,
    staleTime: 30000,
    gcTime: 60000,
    retry: (failureCount, error) => {
      console.error(`🔴 Permissions query retry ${failureCount}:`, error);
      return failureCount < 2;
    }
  });

  // Log permissions query errors
  if (permissionsError) {
    console.error('🔴 Permissions query error:', permissionsError);
  }

  // Secure permission checker - always hits database
  const checkPermission = async (permission: string): Promise<boolean> => {
    if (!authUser?.id) {
      console.log('🔒 No auth user ID for permission check:', permission);
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('current_user_has_permission', {
        permission_name: permission
      });

      if (error) {
        console.error('🔴 Error checking permission:', permission, error);
        return false;
      }

      console.log(`🔒 Permission check result for ${permission}:`, data);
      return data === true;
    } catch (error) {
      console.error('🔴 Exception checking permission:', permission, error);
      return false;
    }
  };

  // Synchronous permission checker (uses database query data only)
  const hasPermission = (permission: string): boolean => {
    if (!authUser?.id) {
      console.log(`🔒 No auth user ID, denying permission: ${permission}`);
      return false;
    }
    
    // For admins, grant all permissions
    if (isAdmin) {
      console.log(`🔒 Admin user, granting permission: ${permission}`);
      return true;
    }
    
    // STRICT: Only return true if permission is explicitly found
    const hasDirectPermission = Array.isArray(userPermissions) && userPermissions.includes(permission);
    console.log(`🔒 Permission check: ${permission} = ${hasDirectPermission}`, {
      userPermissions,
      roleId: currentUser?.role_id,
      isViewOnly: currentUser?.role_id === 2,
      isAdmin,
      authUserId: authUser?.id
    });
    return hasDirectPermission;
  };

  // Helper to check if user is view-only (role_id = 2)
  const isViewOnly = currentUser?.role_id === 2;

  const permissions = {
    isAuthenticated: !!authUser?.id,
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
    canDeleteTrips: hasPermission('trips:delete'),
    // FIX: Use the actual permission check instead of just hasPermission
    canReadAuthUsers: isAdmin || hasPermission('auth-users:read'),
    canAccessDashboard: hasPermission('dashboard:read'),
  };

  // Log final permissions state
  console.log('🔒 Final permissions state:', {
    isAuthenticated: permissions.isAuthenticated,
    isAdmin: permissions.isAdmin,
    isViewOnly: permissions.isViewOnly,
    currentUser: permissions.currentUser,
    canReadCompanies: permissions.canReadCompanies,
    canCreateCompanies: permissions.canCreateCompanies,
    canReadAuthUsers: permissions.canReadAuthUsers,
    errors: {
      currentUserError: currentUserError?.message,
      adminError: adminError?.message,
      permissionsError: permissionsError?.message
    }
  });

  return permissions;
};

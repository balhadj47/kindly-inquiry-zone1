
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

/**
 * SECURE PERMISSIONS HOOK - Database-first, no client-side logic
 * All permission checks go through secure database functions
 */
export const useSecurePermissions = () => {
  const { user: authUser } = useAuth();

  console.log('🔐 useSecurePermissions: Auth user:', authUser?.id);

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
      console.log('🔐 Admin status result:', data);
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
        console.error('❌ User data fetch failed:', error);
        return null;
      }
      console.log('🔐 Current user data result:', data);
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
        console.error('❌ Permissions fetch failed:', error);
        return [];
      }
      console.log('🔐 User permissions result:', data);
      return data || [];
    },
    enabled: !!authUser,
    staleTime: 30000,
    gcTime: 60000,
  });

  // Debug: Let's also check the user's role directly
  const { data: userRoleInfo = null } = useQuery({
    queryKey: ['user-role-debug', authUser?.id],
    queryFn: async () => {
      if (!authUser) return null;
      
      try {
        // Check if user exists in users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name, email, role_id, auth_user_id')
          .eq('auth_user_id', authUser.id)
          .single();
        
        if (userError) {
          console.error('❌ User lookup failed:', userError);
          return { userExists: false, error: userError.message };
        }

        console.log('🔍 User found in database:', userData);

        // Check role information
        if (userData.role_id) {
          const { data: roleData, error: roleError } = await supabase
            .from('user_groups')
            .select('*')
            .eq('role_id', userData.role_id)
            .single();
          
          if (roleError) {
            console.error('❌ Role lookup failed:', roleError);
            return { 
              userExists: true, 
              userData, 
              roleExists: false, 
              roleError: roleError.message 
            };
          }

          console.log('🔍 Role found:', roleData);
          return { 
            userExists: true, 
            userData, 
            roleExists: true, 
            roleData 
          };
        }

        return { userExists: true, userData, roleExists: false };
      } catch (error) {
        console.error('❌ Debug query failed:', error);
        return { error: error.message };
      }
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
        console.error('❌ Permission check failed:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('❌ Permission check exception:', error);
      return false;
    }
  };

  // Synchronous permission checker (uses database query data only)
  const hasPermission = (permission: string): boolean => {
    if (!authUser) {
      console.log('🚫 No auth user for permission check:', permission);
      return false;
    }
    
    // Use the permissions from database query (already handles null role_id)
    const hasDirectPermission = userPermissions.includes(permission);
    if (hasDirectPermission) {
      console.log('🔓 Permission granted via database:', permission);
      return true;
    }
    
    console.log('🚫 Permission denied:', permission, {
      userPermissions,
      isAdmin,
      currentUser: currentUser?.id,
      userRoleInfo,
      hasRole: !!currentUser?.role_id
    });
    return false;
  };

  const permissions = {
    isAuthenticated: !!authUser,
    isAdmin,
    checkPermission,
    hasPermission,
    currentUser,
    userRoleInfo, // Debug info
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

  console.log('🔐 useSecurePermissions: Final permissions:', {
    isAuthenticated: permissions.isAuthenticated,
    isAdmin: permissions.isAdmin,
    canAccessDashboard: permissions.canAccessDashboard,
    canReadCompanies: permissions.canReadCompanies,
    canReadVans: permissions.canReadVans,
    canReadUsers: permissions.canReadUsers,
    canReadTrips: permissions.canReadTrips,
    userPermissions: userPermissions.length,
    permissions: userPermissions,
    currentUser: currentUser?.id || 'null',
    userRoleInfo: userRoleInfo ? 'loaded' : 'null',
    hasRole: !!currentUser?.role_id
  });

  return permissions;
};


import { useContext } from 'react';
import { RBACContext } from './context';
import { hasPermission as checkPermission } from './permissionUtils';

export const useRBAC = () => {
  let context;
  
  try {
    context = useContext(RBACContext);
  } catch (error) {
    console.error('❌ CRITICAL: Error accessing RBACContext:', error);
    context = null;
  }
  
  if (!context) {
    console.error('❌ CRITICAL: useRBAC must be used within a RBACProvider');
    // Return a safe fallback instead of throwing to prevent app crashes
    return {
      currentUser: null,
      users: [],
      roles: [],
      permissions: [],
      loading: true,
      hasPermission: (permission: string) => {
        console.warn('🚫 hasPermission called outside RBACProvider context:', permission);
        return false;
      },
      getUserRole: () => null,
      canUserPerformAction: () => false,
      addUser: async () => ({ success: false, error: 'Context not available' }),
      updateUser: async () => ({ success: false, error: 'Context not available' }),
      deleteUser: async () => ({ success: false, error: 'Context not available' }),
      changeUserPassword: async () => ({ success: false, error: 'Context not available' }),
      addRole: async () => ({ success: false, error: 'Context not available' }),
      updateRole: async () => ({ success: false, error: 'Context not available' }),
      deleteRole: async () => ({ success: false, error: 'Context not available' }),
      setUser: () => {},
    };
  }

  const { currentUser, users, roles, permissions, loading } = context;
  
  const hasPermission = (permission: string): boolean => {
    try {
      console.log('🔐 RBAC hasPermission called with:', permission);
      console.log('🔐 Current user:', currentUser?.id, 'role_id:', currentUser?.role_id);
      console.log('🔐 Loading state:', loading);
      console.log('🔐 Roles available:', roles?.length || 0);

      // Safety check for permission parameter
      if (!permission || typeof permission !== 'string') {
        console.warn('🚫 Invalid permission parameter:', permission);
        return false;
      }

      // Safety check for current user
      if (!currentUser || !currentUser.id) {
        console.log('🚫 No current user for permission check:', permission);
        return false;
      }

      // Special handling for admin users - always grant access
      if (currentUser.id === 'admin-temp' || currentUser.role_id === 1) {
        console.log('🔓 Admin user detected - granting all permissions:', permission);
        return true;
      }

      // Safety check for roles array
      if (!Array.isArray(roles) || roles.length === 0) {
        console.log('⚠️ Roles not loaded or invalid, denying permission for non-admin:', permission);
        return false;
      }

      // If we have roles loaded from database, use the permission system
      const result = checkPermission(String(currentUser.id), permission);
      console.log(`🔐 Database permission check result: ${permission} = ${result} for user ${currentUser.id}`);
      return result;

    } catch (error) {
      console.error('❌ CRITICAL ERROR in permission check:', error);
      console.error('❌ Permission:', permission);
      console.error('❌ Current user:', currentUser);
      console.error('❌ Roles:', roles);
      
      // Fallback for administrators in case of errors
      if (currentUser?.role_id === 1 || currentUser?.id === 'admin-temp') {
        console.log('🔧 Fallback: granting admin access due to error');
        return true;
      }
      return false;
    }
  };

  const getUserRole = (userId: string) => {
    try {
      if (!currentUser || currentUser.id !== userId) {
        return null;
      }
      
      if (!Array.isArray(roles)) {
        console.warn('🔧 Roles array not available for getUserRole');
        return null;
      }
      
      // Find role by role_id
      const role = roles.find(r => parseInt(r.id) === currentUser.role_id);
      return role || null;
    } catch (error) {
      console.error('🔧 Error in getUserRole:', error);
      return null;
    }
  };

  const canUserPerformAction = (userId: string, action: string): boolean => {
    try {
      const userRole = getUserRole(userId);
      if (!userRole) {
        return false;
      }
      
      return Array.isArray(userRole.permissions) && userRole.permissions.includes(action);
    } catch (error) {
      console.error('🔧 Error in canUserPerformAction:', error);
      return false;
    }
  };

  return {
    currentUser,
    users: Array.isArray(users) ? users : [],
    roles: Array.isArray(roles) ? roles : [],
    permissions: Array.isArray(permissions) ? permissions : [],
    loading: Boolean(loading),
    hasPermission,
    getUserRole,
    canUserPerformAction,
    ...context,
  };
};


import { useContext } from 'react';
import { RBACContext } from './context';
import { hasPermission as checkPermission } from './permissionUtils';

export const useRBAC = () => {
  const context = useContext(RBACContext);
  
  if (!context) {
    console.error('❌ CRITICAL: useRBAC must be used within a RBACProvider');
    throw new Error('useRBAC must be used within a RBACProvider');
  }

  const { currentUser, users, roles, permissions, loading } = context;
  
  const hasPermission = (permission: string): boolean => {
    try {
      console.log('🔐 RBAC hasPermission called with:', permission);
      console.log('🔐 Current user:', currentUser?.id, currentUser?.role_id);
      console.log('🔐 Loading state:', loading);
      console.log('🔐 Roles available:', roles.length);

      if (!currentUser) {
        console.log('🚫 No current user for permission check:', permission);
        return false;
      }

      // Special handling for admin temporary user - always grant access
      if (currentUser.id === 'admin-temp' || currentUser.role_id === 1) {
        console.log('🔓 Admin user detected - granting all permissions:', permission);
        return true;
      }

      // If we have roles loaded, use the permission system
      if (roles && roles.length > 0) {
        const result = checkPermission(currentUser.id.toString(), permission);
        console.log(`🔐 Permission check result: ${permission} = ${result} for user ${currentUser.id}`);
        return result;
      }

      // Fallback: if no roles loaded yet, deny access for non-admins
      console.log('⚠️ No roles loaded, denying permission for non-admin:', permission);
      return false;

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

  return {
    currentUser,
    users,
    roles,
    permissions,
    loading,
    hasPermission,
    ...context,
  };
};

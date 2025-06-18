
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
      console.log('🔐 Current user:', currentUser?.id, currentUser?.systemGroup);
      console.log('🔐 Loading state:', loading);
      console.log('🔐 Roles available:', roles?.length || 0);

      if (!currentUser) {
        console.log('🚫 No current user for permission check:', permission);
        return false;
      }

      // Special handling for admin temporary user
      if (currentUser.id === 'admin-temp' && currentUser.systemGroup === 'Administrator') {
        console.log('🔓 Admin temp user - granting all permissions:', permission);
        return true;
      }

      if (loading && roles.length === 0) {
        console.log('⏳ RBAC still loading with no roles, denying access:', permission);
        return false;
      }

      if (!roles || roles.length === 0) {
        console.warn('⚠️ No roles loaded, checking if administrator:', permission);
        // Fallback for administrators when roles aren't loaded yet
        return currentUser.systemGroup === 'Administrator';
      }

      const result = checkPermission(currentUser.id.toString(), permission);
      console.log(`🔐 Permission check result: ${permission} = ${result} for user ${currentUser.id}`);
      return result;
    } catch (error) {
      console.error('❌ CRITICAL ERROR in permission check:', error);
      console.error('❌ Error details:', {
        permission,
        currentUser: currentUser?.id,
        roles: roles?.length,
        loading
      });
      
      // Fallback for administrators in case of errors
      if (currentUser?.systemGroup === 'Administrator') {
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


import { useContext } from 'react';
import { RBACContext } from './context';
import { hasPermission as checkPermission } from './permissionUtils';

export const useRBAC = () => {
  const context = useContext(RBACContext);
  
  if (!context) {
    throw new Error('useRBAC must be used within a RBACProvider');
  }

  const { currentUser, users, roles, permissions, loading } = context;
  
  const hasPermission = (permission: string): boolean => {
    console.log('🔐 RBAC hasPermission called with:', permission);
    console.log('🔐 Current user:', currentUser?.id, currentUser?.systemGroup);
    console.log('🔐 Loading state:', loading);
    console.log('🔐 Roles available:', roles.length);

    if (!currentUser) {
      console.log('🚫 No current user for permission check:', permission);
      return false;
    }

    if (loading) {
      console.log('⏳ RBAC still loading, allowing access temporarily:', permission);
      return true; // Allow access while loading to prevent UI flash
    }

    if (roles.length === 0) {
      console.warn('⚠️ No roles loaded, denying permission:', permission);
      return false;
    }

    try {
      const result = checkPermission(currentUser.id.toString(), permission);
      console.log(`🔐 Permission check result: ${permission} = ${result} for user ${currentUser.id}`);
      return result;
    } catch (error) {
      console.error('❌ Error in permission check:', error);
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

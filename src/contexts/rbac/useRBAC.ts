
import { useContext } from 'react';
import { RBACContext } from './context';
import { hasPermission as checkPermission } from './permissionUtils';

export const useRBAC = () => {
  const context = useContext(RBACContext);
  
  if (!context) {
    throw new Error('useRBAC must be used within a RBACProvider');
  }

  const { state, actions } = context;
  
  const hasPermission = (permission: string): boolean => {
    if (!state.currentUser) {
      console.log('🚫 No current user for permission check:', permission);
      return false;
    }

    if (state.loading) {
      console.log('⏳ RBAC still loading, allowing access temporarily:', permission);
      return true; // Allow access while loading to prevent UI flash
    }

    if (state.roles.length === 0) {
      console.warn('⚠️ No roles loaded, denying permission:', permission);
      return false;
    }

    try {
      const result = checkPermission(state.currentUser.id.toString(), permission);
      console.log(`🔐 Permission check: ${permission} = ${result} for user ${state.currentUser.id}`);
      return result;
    } catch (error) {
      console.error('❌ Error in permission check:', error);
      return false;
    }
  };

  return {
    ...state,
    ...actions,
    hasPermission,
  };
};

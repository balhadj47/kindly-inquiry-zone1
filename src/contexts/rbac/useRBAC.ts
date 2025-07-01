
import { useContext } from 'react';
import { RBACContext } from './context';
import { hasPermission, getUserRole, canUserPerformAction, setGlobalPermissionState } from './permissionUtils';
import { extractContextValues, createFallbackContext } from './contextValidation';

export const useRBAC = () => {
  let context;
  
  try {
    context = useContext(RBACContext);
  } catch (error) {
    context = null;
  }
  
  if (!context) {
    return createFallbackContext();
  }

  // Extract and validate context values
  const { currentUser, users, roles, permissions, loading } = extractContextValues(context);
  
  // Update global permission state for permission utilities
  setGlobalPermissionState(currentUser, roles);
  
  // Create permission checking function with current user context
  const hasPermissionForCurrentUser = (permission: string): boolean => {
    if (!currentUser?.id) {
      return false;
    }
    return hasPermission(currentUser.id, permission);
  };

  // Create getUserRole function with current user context
  const getUserRoleForCurrentUser = (userId: string) => {
    return getUserRole(userId);
  };

  // Create canUserPerformAction function with current user context
  const canUserPerformActionForCurrentUser = (userId: string, action: string): boolean => {
    return canUserPerformAction(userId, action);
  };

  return {
    currentUser,
    users,
    roles,
    permissions,
    loading,
    hasPermission: hasPermissionForCurrentUser,
    getUserRole: getUserRoleForCurrentUser,
    canUserPerformAction: canUserPerformActionForCurrentUser,
    ...context,
  };
};

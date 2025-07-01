
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

  const { currentUser, users, roles, permissions, loading } = extractContextValues(context);
  
  setGlobalPermissionState(currentUser, roles);
  
  const hasPermissionForCurrentUser = (permission: string): boolean => {
    if (!currentUser?.id) {
      return false;
    }
    return hasPermission(currentUser.id, permission);
  };

  const getUserRoleForCurrentUser = (userId: string) => {
    return getUserRole(userId);
  };

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

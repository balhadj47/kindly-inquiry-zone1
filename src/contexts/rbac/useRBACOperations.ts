
import React from 'react';
import type { User } from '@/types/rbac';
import type { SystemGroup } from '@/types/systemGroups';
import { createRoleOperations } from './roleOperations';
import { hasPermission as checkPermission } from './permissionUtils';
import { createUserOperations } from './userOperations';

interface UseRBACOperationsProps {
  currentUser: User | null;
  roles: SystemGroup[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>;
}

export const useRBACOperations = ({ 
  currentUser, 
  roles, 
  setUsers, 
  setRoles 
}: UseRBACOperationsProps) => {
  if (!React || !React.useState) {
    throw new Error('React hooks not available');
  }

  // Create role operations  
  const roleOperations = createRoleOperations(setRoles);
  
  // Create user operations
  const userOperations = createUserOperations(setUsers);

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) {
      return false;
    }

    // Check permission using current auth user
    try {
      return checkPermission(currentUser.id.toString(), permission);
    } catch (error) {
      return false;
    }
  };

  const getUserRole = (userId: string): SystemGroup | null => {
    if (!currentUser || currentUser.id !== userId) {
      return null;
    }
    
    // Find role by role_id
    const role = roles.find(r => parseInt(r.id) === currentUser.role_id);
    return role || null;
  };

  const canUserPerformAction = (userId: string, action: string): boolean => {
    const userRole = getUserRole(userId);
    if (!userRole) {
      return false;
    }
    
    return userRole.permissions.includes(action);
  };

  return {
    // User operations (now functional for employees)
    addUser: userOperations.addUser,
    updateUser: userOperations.updateUser,
    deleteUser: userOperations.deleteUser,
    changeUserPassword: userOperations.changeUserPassword,
    
    // Role operations (still functional)
    addRole: roleOperations.addRole,
    updateRole: roleOperations.updateRole,
    deleteRole: roleOperations.deleteRole,
    
    // Permission operations (using auth user)
    hasPermission,
    getUserRole,
    canUserPerformAction,
  };
};

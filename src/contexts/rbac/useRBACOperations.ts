
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
  const roleOperations = createRoleOperations(setRoles);
  const userOperations = createUserOperations(setUsers);

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) {
      return false;
    }

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
    addUser: userOperations.addUser,
    updateUser: userOperations.updateUser,
    deleteUser: userOperations.deleteUser,
    changeUserPassword: userOperations.changeUserPassword,
    addRole: roleOperations.addRole,
    updateRole: roleOperations.updateRole,
    deleteRole: roleOperations.deleteRole,
    hasPermission,
    getUserRole,
    canUserPerformAction,
  };
};

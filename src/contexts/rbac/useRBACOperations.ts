
import React from 'react';
import type { User } from '@/types/rbac';
import type { SystemGroup } from '@/types/systemGroups';
import { createUserOperations } from './userOperations';
import { createRoleOperations } from './roleOperations';
import { hasPermission as checkPermission } from './permissionUtils';

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
  console.log('🔧 useRBACOperations: Initializing with React:', !!React);

  if (!React || !React.useState) {
    console.error('❌ CRITICAL: React hooks not available in useRBACOperations');
    throw new Error('React hooks not available');
  }

  // Create user operations
  const userOperations = createUserOperations(setUsers);

  // Create role operations  
  const roleOperations = createRoleOperations(setRoles);

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) {
      return false;
    }

    // Check permission using role_id
    try {
      return checkPermission(currentUser.id.toString(), permission);
    } catch (error) {
      console.error('Error checking permission:', error);
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

  const getMenuItemPermissions = () => {
    return {
      dashboard: hasPermission('dashboard:read'),
      companies: hasPermission('companies:read'),
      vans: hasPermission('vans:read'),
      users: hasPermission('users:read'),
      tripLogger: hasPermission('trips:create'),
      tripHistory: hasPermission('trips:read'),
    };
  };

  return {
    // User operations
    addUser: userOperations.addUser,
    updateUser: userOperations.updateUser,
    deleteUser: userOperations.deleteUser,
    changeUserPassword: userOperations.changeUserPassword,
    
    // Role operations
    addRole: roleOperations.addRole,
    updateRole: roleOperations.updateRole,
    deleteRole: roleOperations.deleteRole,
    
    // Permission operations
    hasPermission,
    getUserRole,
    canUserPerformAction,
    getMenuItemPermissions,
  };
};

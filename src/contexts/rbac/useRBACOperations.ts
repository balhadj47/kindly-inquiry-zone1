
import React from 'react';
import type { User } from '@/types/rbac';
import type { SystemGroup } from '@/types/systemGroups';
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
  console.log('🔧 useRBACOperations: Initializing auth-first operations');

  if (!React || !React.useState) {
    console.error('❌ CRITICAL: React hooks not available in useRBACOperations');
    throw new Error('React hooks not available');
  }

  // Create role operations  
  const roleOperations = createRoleOperations(setRoles);

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) {
      return false;
    }

    // Check permission using current auth user
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

  // Simplified user operations that don't affect auth
  const addUser = async (userData: Partial<User>): Promise<void> => {
    throw new Error('User creation should be handled through Supabase Auth signup');
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    throw new Error('Auth user updates should be handled through Supabase Auth');
  };

  const deleteUser = async (id: string): Promise<void> => {
    throw new Error('Auth user deletion should be handled through Supabase Auth');
  };

  const changeUserPassword = async (userEmail: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    throw new Error('Password changes should be handled through Supabase Auth');
  };

  return {
    // User operations (disabled for auth-first approach)
    addUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    
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

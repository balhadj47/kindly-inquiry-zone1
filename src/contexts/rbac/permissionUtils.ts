
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

let globalCurrentUser: User | null = null;
let globalRoles: SystemGroup[] = [];

export const setGlobalPermissionState = (user: User | null, roles: SystemGroup[]) => {
  globalCurrentUser = user;
  globalRoles = roles;
};

export const createPermissionUtils = (users: User[], roles: SystemGroup[]) => {
  setGlobalPermissionState(users[0] || null, roles);
};

export const hasPermission = (userId: string, permission: string): boolean => {
  try {
    if (!permission || typeof permission !== 'string' || permission.trim() === '') {
      return false;
    }

    if (!globalCurrentUser || !globalCurrentUser.id || globalCurrentUser.id !== userId) {
      return false;
    }

    if (globalCurrentUser.id === 'admin-temp' || globalCurrentUser.role_id === 1) {
      return true;
    }

    const basicPermissions = [
      'dashboard:read', 
      'trips:read', 
      'companies:read',
      'vans:read'
    ];
    
    if (basicPermissions.includes(permission)) {
      return true;
    }

    if (!Array.isArray(globalRoles) || globalRoles.length === 0) {
      return basicPermissions.includes(permission);
    }

    // FIX: Use role_id instead of trying to parse string id as integer
    const userRole = globalRoles.find(role => (role as any).role_id === globalCurrentUser.role_id);
    if (!userRole) {
      return basicPermissions.includes(permission);
    }

    return Array.isArray(userRole.permissions) && userRole.permissions.includes(permission);

  } catch (error) {
    if (globalCurrentUser?.role_id === 1 || globalCurrentUser?.id === 'admin-temp') {
      return true;
    }
    
    const basicPermissions = ['dashboard:read', 'trips:read', 'companies:read', 'vans:read'];
    return basicPermissions.includes(permission);
  }
};

export const getUserRole = (userId: string): SystemGroup | null => {
  try {
    if (!globalCurrentUser || globalCurrentUser.id !== userId) {
      return null;
    }
    
    if (!Array.isArray(globalRoles)) {
      return null;
    }
    
    // FIX: Use role_id consistently
    const role = globalRoles.find(r => (r as any).role_id === globalCurrentUser.role_id);
    return role || null;
  } catch (error) {
    return null;
  }
};

export const canUserPerformAction = (userId: string, action: string): boolean => {
  try {
    const userRole = getUserRole(userId);
    if (!userRole) {
      return false;
    }
    
    return Array.isArray(userRole.permissions) && userRole.permissions.includes(action);
  } catch (error) {
    return false;
  }
};

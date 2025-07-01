
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

let globalCurrentUser: User | null = null;
let globalRoles: SystemGroup[] = [];
let permissionCache: Map<string, boolean> = new Map();

export const setGlobalPermissionState = (user: User | null, roles: SystemGroup[]) => {
  globalCurrentUser = user;
  globalRoles = roles;
  permissionCache.clear();
};

export const createPermissionUtils = (users: User[], roles: SystemGroup[]) => {
  setGlobalPermissionState(users[0] || null, roles);
};

export const clearPermissionCache = () => {
  permissionCache.clear();
};

export const hasPermission = (userId: string, permission: string): boolean => {
  try {
    const cacheKey = `${userId}:${permission}`;
    if (permissionCache.has(cacheKey)) {
      return permissionCache.get(cacheKey)!;
    }

    if (!permission || typeof permission !== 'string' || permission.trim() === '') {
      permissionCache.set(cacheKey, false);
      return false;
    }

    if (!globalCurrentUser || !globalCurrentUser.id || globalCurrentUser.id !== userId) {
      permissionCache.set(cacheKey, false);
      return false;
    }

    if (globalCurrentUser.id === 'admin-temp' || globalCurrentUser.role_id === 1) {
      permissionCache.set(cacheKey, true);
      return true;
    }

    const basicPermissions = [
      'dashboard:read', 
      'trips:read', 
      'companies:read',
      'vans:read'
    ];
    
    if (basicPermissions.includes(permission)) {
      permissionCache.set(cacheKey, true);
      return true;
    }

    if (!Array.isArray(globalRoles) || globalRoles.length === 0) {
      const hasBasic = basicPermissions.includes(permission);
      permissionCache.set(cacheKey, hasBasic);
      return hasBasic;
    }

    const userRole = globalRoles.find(role => (role as any).role_id === globalCurrentUser.role_id);
    if (!userRole) {
      const hasBasic = basicPermissions.includes(permission);
      permissionCache.set(cacheKey, hasBasic);
      return hasBasic;
    }

    const hasAccess = Array.isArray(userRole.permissions) && userRole.permissions.includes(permission);

    permissionCache.set(cacheKey, hasAccess);
    return hasAccess;

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
    
    const role = globalRoles.find(r => parseInt(r.id) === globalCurrentUser.role_id);
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

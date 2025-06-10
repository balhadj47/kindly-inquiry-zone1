
import { RBACUser, RBACGroup } from './types';

// Cache for permission checks to avoid repeated calculations
const permissionCache = new Map<string, boolean>();

export const hasPermission = (
  permission: string,
  user: RBACUser | null,
  groups: RBACGroup[]
): boolean => {
  if (!user || !user.groupId) {
    return false;
  }

  // Create cache key
  const cacheKey = `${user.id}-${user.groupId}-${permission}`;
  
  // Check cache first
  if (permissionCache.has(cacheKey)) {
    return permissionCache.get(cacheKey)!;
  }

  const userGroup = groups.find(group => group.id === user.groupId);
  const hasPermissionResult = userGroup?.permissions.includes(permission) || false;
  
  // Cache the result
  permissionCache.set(cacheKey, hasPermissionResult);
  
  return hasPermissionResult;
};

export const getMenuItemPermissions = (user: RBACUser | null, groups: RBACGroup[]) => {
  const permissions = {
    dashboard: hasPermission('dashboard.view', user, groups),
    companies: hasPermission('companies.view', user, groups),
    vans: hasPermission('vans.view', user, groups),
    users: hasPermission('users.view', user, groups),
    tripLogger: hasPermission('trips.log', user, groups),
    tripHistory: hasPermission('trips.view', user, groups),
  };

  return permissions;
};

export const createPermissionUtils = (currentUser: RBACUser | null, groups: RBACGroup[]) => ({
  hasPermission: (permission: string) => hasPermission(permission, currentUser, groups),
  getMenuItemPermissions: () => getMenuItemPermissions(currentUser, groups),
});

// Clear cache when user changes
export const clearPermissionCache = () => {
  permissionCache.clear();
};

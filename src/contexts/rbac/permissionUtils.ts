
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
    console.log(`Permission cache hit for ${permission}: ${permissionCache.get(cacheKey)}`);
    return permissionCache.get(cacheKey)!;
  }

  console.log(`Permission cache miss for ${permission}, calculating...`);
  const userGroup = groups.find(group => group.id === user.groupId);
  const hasPermissionResult = userGroup?.permissions.includes(permission) || false;
  
  // Cache the result
  permissionCache.set(cacheKey, hasPermissionResult);
  console.log(`Cached permission for ${permission}: ${hasPermissionResult}`);
  
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

// Create a stable permission checker that uses cache
export const createPermissionUtils = (currentUser: RBACUser | null, groups: RBACGroup[]) => {
  // Create a stable reference to the hasPermission function
  const stableHasPermission = (permission: string) => hasPermission(permission, currentUser, groups);
  
  return {
    hasPermission: stableHasPermission,
    getMenuItemPermissions: () => getMenuItemPermissions(currentUser, groups),
  };
};

// Clear cache when user changes
export const clearPermissionCache = () => {
  console.log('Clearing permission cache');
  permissionCache.clear();
};

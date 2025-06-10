
import { RBACUser, RBACGroup } from './types';

// Cache for permission checks to avoid repeated calculations
const permissionCache = new Map<string, boolean>();

export const hasPermission = (
  permission: string,
  user: RBACUser | null,
  groups: RBACGroup[]
): boolean => {
  if (!user || !user.groupId) {
    console.log(`Permission check failed: No user or groupId. User: ${user?.id}, GroupId: ${user?.groupId}`);
    return false;
  }

  // Don't use cache if groups are empty (still loading)
  if (groups.length === 0) {
    console.log(`Permission check skipped: Groups still loading for permission ${permission}`);
    return false;
  }

  // Create cache key
  const cacheKey = `${user.id}-${user.groupId}-${permission}`;
  
  // Check cache first
  if (permissionCache.has(cacheKey)) {
    const cachedResult = permissionCache.get(cacheKey)!;
    console.log(`Permission cache hit for ${permission}: ${cachedResult}`);
    return cachedResult;
  }

  console.log(`Permission cache miss for ${permission}, calculating...`);
  console.log(`Looking for group: ${user.groupId} in groups:`, groups.map(g => g.id));
  
  const userGroup = groups.find(group => group.id === user.groupId);
  
  if (!userGroup) {
    console.log(`Group not found: ${user.groupId}`);
    return false;
  }

  console.log(`Found group: ${userGroup.name} with permissions:`, userGroup.permissions);
  
  const hasPermissionResult = userGroup.permissions.includes(permission);
  
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

  console.log('Menu permissions calculated:', permissions);
  return permissions;
};

// Create a stable permission checker that uses cache
export const createPermissionUtils = (currentUser: RBACUser | null, groups: RBACGroup[]) => {
  console.log('Creating permission utils for user:', currentUser?.id, 'with groups:', groups.length);
  
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

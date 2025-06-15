
import { RBACUser, RBACGroup } from './types';

// Cache for permission checks to avoid repeated calculations
const permissionCache = new Map<string, boolean>();

export const hasPermission = (
  permission: string,
  user: RBACUser | null,
  groups: RBACGroup[]
): boolean => {
  console.log(`=== Permission Check Debug ===`);
  console.log(`Checking permission: ${permission}`);
  console.log(`User:`, user ? { id: user.id, role: user.role, groupId: user.groupId } : 'null');
  console.log(`Groups available:`, groups.map(g => ({ id: g.id, name: g.name, permissions: g.permissions })));

  if (!user || !user.groupId) {
    console.log(`Permission check failed: No user or groupId. User: ${user?.id}, GroupId: ${user?.groupId}`);
    return false;
  }

  // Create cache key
  const cacheKey = `${user.id}-${user.groupId}-${permission}`;
  
  // Check cache first (but skip if groups are empty)
  if (groups.length > 0 && permissionCache.has(cacheKey)) {
    const cachedResult = permissionCache.get(cacheKey)!;
    console.log(`Permission cache hit for ${permission}: ${cachedResult}`);
    return cachedResult;
  }

  console.log(`Permission cache miss for ${permission}, calculating...`);
  console.log(`Looking for group: ${user.groupId} in groups:`, groups.map(g => g.id));
  
  // Try to find the group by ID first
  let userGroup = groups.find(group => group.id === user.groupId);
  
  // If not found by ID, and the user is an administrator, try to find the administrator group
  if (!userGroup && user.role === 'Administrator') {
    console.log('Administrator user, looking for administrator group by ID');
    userGroup = groups.find(group => group.id === 'administrator');
    
    if (!userGroup) {
      console.log('No administrator group found by ID, checking all groups for administrator permissions');
      // Look for any group that has all admin permissions as fallback
      userGroup = groups.find(group => 
        group.permissions.includes('users:read') && 
        group.permissions.includes('companies:read') &&
        group.permissions.includes('dashboard:read')
      );
    }
  }
  
  if (!userGroup) {
    console.log(`Group not found: ${user.groupId}`);
    console.log(`Available groups:`, groups.map(g => ({ id: g.id, name: g.name })));
    // If groups are loaded but user's group not found, still allow basic dashboard access
    if (groups.length > 0 && permission === 'dashboard:read') {
      console.log('Allowing dashboard access as fallback');
      return true;
    }
    return false;
  }

  console.log(`Found group: ${userGroup.name} (ID: ${userGroup.id}) with permissions:`, userGroup.permissions);
  
  // Ensure permissions is an array
  const permissions = Array.isArray(userGroup.permissions) ? userGroup.permissions : [];
  const hasPermissionResult = permissions.includes(permission);
  
  // Cache the result only if groups are loaded
  if (groups.length > 0) {
    permissionCache.set(cacheKey, hasPermissionResult);
  }
  
  console.log(`Permission result for ${permission}: ${hasPermissionResult}`);
  console.log(`=== End Permission Check ===`);
  
  return hasPermissionResult;
};

export const getMenuItemPermissions = (user: RBACUser | null, groups: RBACGroup[]) => {
  const permissions = {
    dashboard: hasPermission('dashboard:read', user, groups),
    companies: hasPermission('companies:read', user, groups),
    vans: hasPermission('vans:read', user, groups),
    users: hasPermission('users:read', user, groups),
    tripLogger: hasPermission('trips:create', user, groups),
    tripHistory: hasPermission('trips:read', user, groups),
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

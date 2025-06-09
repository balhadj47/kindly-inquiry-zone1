
import { RBACUser, RBACGroup } from './types';

export const hasPermission = (
  permission: string,
  user: RBACUser | null,
  groups: RBACGroup[]
): boolean => {
  console.log('Checking permission:', permission);
  console.log('Current user:', user);
  console.log('Available groups:', groups);

  if (!user) {
    console.log('No user found, permission denied');
    return false;
  }

  if (!user.groupId) {
    console.log('User has no group ID, permission denied');
    return false;
  }

  const userGroup = groups.find(group => group.id === user.groupId);
  console.log('User group found:', userGroup);

  if (!userGroup) {
    console.log('User group not found in groups list, permission denied');
    return false;
  }

  const hasPermissionResult = userGroup.permissions.includes(permission);
  console.log(`Permission for ${permission}: ${hasPermissionResult}`);
  
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

  console.log('Menu permissions:', permissions);
  return permissions;
};

export const createPermissionUtils = (currentUser: RBACUser | null, groups: RBACGroup[]) => ({
  hasPermission: (permission: string) => hasPermission(permission, currentUser, groups),
  getMenuItemPermissions: () => getMenuItemPermissions(currentUser, groups),
});

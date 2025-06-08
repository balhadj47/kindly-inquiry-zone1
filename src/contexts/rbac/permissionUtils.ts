
import type { User, UserGroup } from '@/types/rbac';

export const createPermissionUtils = (currentUser: User | null, groups: UserGroup[]) => {
  const hasPermission = (permission: string): boolean => {
    console.log(`Checking permission: ${permission}`);
    console.log('Current user:', currentUser);
    
    if (!currentUser) {
      console.log('No current user, permission denied');
      return false;
    }

    const userGroup = groups.find(g => g.id === currentUser.groupId);
    console.log('User group:', userGroup);
    console.log('Available groups:', groups);
    
    if (!userGroup) {
      console.log('No group found for user, permission denied');
      return false;
    }

    const hasPermission = userGroup.permissions.includes(permission);
    console.log(`Permission ${permission} result:`, hasPermission);
    console.log('User group permissions:', userGroup.permissions);
    
    return hasPermission;
  };

  const getUserGroup = (user: User): UserGroup | undefined => {
    return groups.find(g => g.id === user.groupId);
  };

  return { hasPermission, getUserGroup };
};

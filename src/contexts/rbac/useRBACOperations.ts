
import { useMemo } from 'react';
import type { User, Group } from '@/types/rbac';
import { createPermissionUtils } from './permissionUtils';
import { createUserOperations } from './userOperations';
import { createGroupOperations } from './groupOperations';

interface UseRBACOperationsProps {
  currentUser: User | null;
  groups: Group[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
}

export const useRBACOperations = ({
  currentUser,
  groups,
  setUsers,
  setGroups,
}: UseRBACOperationsProps) => {
  // Memoize permission utils to prevent recreation on every render
  const permissionUtils = useMemo(() => {
    console.log('Creating permission utils - User:', currentUser?.id, 'Groups:', groups.length);
    
    if (!currentUser || groups.length === 0) {
      console.log('Skipping permission utils creation - missing data');
      return {
        hasPermission: () => false,
        getMenuItemPermissions: () => ({
          dashboard: false,
          companies: false,
          vans: false,
          users: false,
          tripLogger: false,
          tripHistory: false,
        }),
      };
    }
    
    return createPermissionUtils(currentUser, groups);
  }, [currentUser?.id, currentUser?.groupId, groups.length, groups]);

  const userOperations = useMemo(() => createUserOperations(setUsers), [setUsers]);
  const groupOperations = useMemo(() => createGroupOperations(setGroups), [setGroups]);

  return useMemo(() => ({
    ...userOperations,
    ...groupOperations,
    ...permissionUtils,
  }), [userOperations, groupOperations, permissionUtils]);
};

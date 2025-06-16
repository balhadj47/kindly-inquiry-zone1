
import { useMemo } from 'react';
import type { User, Role } from '@/types/rbac';
import { createPermissionUtils } from './permissionUtils';
import { createUserOperations } from './userOperations';
import { createRoleOperations } from './roleOperations';

interface UseRBACOperationsProps {
  currentUser: User | null;
  roles: Role[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export const useRBACOperations = ({
  currentUser,
  roles,
  setUsers,
  setRoles,
}: UseRBACOperationsProps) => {
  // Memoize permission utils to prevent recreation on every render
  const permissionUtils = useMemo(() => {
    console.log('Creating permission utils - User:', currentUser?.id, 'Roles:', roles.length);
    
    if (!currentUser || roles.length === 0) {
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
    
    return createPermissionUtils(currentUser, roles);
  }, [currentUser?.id, currentUser?.role, roles.length, roles]);

  const userOperations = useMemo(() => createUserOperations(setUsers), [setUsers]);
  const roleOperations = useMemo(() => createRoleOperations(setRoles), [setRoles]);

  return useMemo(() => ({
    ...userOperations,
    ...roleOperations,
    ...permissionUtils,
  }), [userOperations, roleOperations, permissionUtils]);
};

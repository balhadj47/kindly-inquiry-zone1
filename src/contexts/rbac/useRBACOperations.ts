
import { useMemo } from 'react';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';
import { createPermissionUtils } from './permissionUtils';
import { createUserOperations } from './userOperations';
import { createRoleOperations } from './roleOperations';

interface UseRBACOperationsProps {
  currentUser: User | null;
  roles: SystemGroup[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>;
}

export const useRBACOperations = ({
  currentUser,
  roles,
  setUsers,
  setRoles,
}: UseRBACOperationsProps) => {
  // Memoize permission utils to prevent recreation on every render
  const permissionUtils = useMemo(() => {
    console.log('Creating permission utils - User:', currentUser?.id, 'System Groups:', roles.length);
    
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
    
    // Create permission utils with all users and system groups
    const allUsers = currentUser ? [currentUser] : [];
    createPermissionUtils(allUsers, roles);
    
    return {
      hasPermission: (permission: string) => {
        const userSystemGroup = roles.find(r => r.name === currentUser.systemGroup);
        return userSystemGroup?.permissions.includes(permission) || false;
      },
      getMenuItemPermissions: () => {
        const userSystemGroup = roles.find(r => r.name === currentUser.systemGroup);
        const permissions = userSystemGroup?.permissions || [];
        
        return {
          dashboard: permissions.includes('dashboard:read'),
          companies: permissions.includes('companies:read'),
          vans: permissions.includes('vans:read'),
          users: permissions.includes('users:read'),
          tripLogger: permissions.includes('trips:create'),
          tripHistory: permissions.includes('trips:read'),
        };
      },
    };
  }, [currentUser?.id, currentUser?.systemGroup, roles.length, roles]);

  const userOperations = useMemo(() => createUserOperations(setUsers), [setUsers]);
  const roleOperations = useMemo(() => createRoleOperations(setRoles), [setRoles]);

  return useMemo(() => ({
    ...userOperations,
    ...roleOperations,
    ...permissionUtils,
  }), [userOperations, roleOperations, permissionUtils]);
};

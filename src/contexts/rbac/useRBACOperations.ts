
import { useMemo } from 'react';
import type { User, UserGroup } from '@/types/rbac';
import { createPermissionUtils } from './permissionUtils';
import { createUserOperations } from './userOperations';

interface UseRBACOperationsProps {
  currentUser: User | null;
  groups: UserGroup[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setGroups: React.Dispatch<React.SetStateAction<UserGroup[]>>;
}

export const useRBACOperations = ({
  currentUser,
  groups,
  setUsers,
  setGroups,
}: UseRBACOperationsProps) => {
  // Memoize permission utils to prevent recreation on every render
  // Only create when we have both user and groups data
  const permissionUtils = useMemo(() => {
    console.log('Creating permission utils - User:', currentUser?.id, 'Groups:', groups.length);
    
    // Wait for groups to be loaded before creating permission utils
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

  // Group operations - memoized to prevent recreation
  const groupOperations = useMemo(() => {
    const addGroup = async (groupData: any): Promise<void> => {
      console.log('Adding group:', groupData);
      const newGroup: UserGroup = {
        id: Date.now().toString(),
        name: groupData.name,
        description: groupData.description,
        color: groupData.color,
        permissions: groupData.permissions || [],
      };
      
      setGroups(prev => [...prev, newGroup]);
    };

    const updateGroup = async (groupId: string, groupData: any): Promise<void> => {
      console.log('Updating group:', groupId, groupData);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? { ...group, ...groupData } : group
      ));
    };

    const deleteGroup = async (groupId: string): Promise<void> => {
      console.log('Deleting group:', groupId);
      setGroups(prev => prev.filter(group => group.id !== groupId));
    };

    return { addGroup, updateGroup, deleteGroup };
  }, [setGroups]);

  return useMemo(() => ({
    ...userOperations,
    ...groupOperations,
    ...permissionUtils,
  }), [userOperations, groupOperations, permissionUtils]);
};

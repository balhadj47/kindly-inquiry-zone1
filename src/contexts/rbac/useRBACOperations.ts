
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
  const permissionUtils = createPermissionUtils(currentUser, groups);
  const userOperations = createUserOperations(setUsers);

  // Group operations
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

  return {
    ...userOperations,
    addGroup,
    updateGroup,
    deleteGroup,
    ...permissionUtils,
  };
};

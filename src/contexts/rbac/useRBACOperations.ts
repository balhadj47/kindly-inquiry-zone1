
import type { User, UserGroup } from '@/types/rbac';
import { createUserOperations } from './userOperations';
import { createGroupOperations } from './groupOperations';
import { createPermissionUtils } from './permissionUtils';

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
  const userOperations = createUserOperations(setUsers);
  const groupOperations = createGroupOperations(setGroups);
  const permissionUtils = createPermissionUtils(currentUser, groups);

  return {
    ...userOperations,
    ...groupOperations,
    ...permissionUtils,
  };
};

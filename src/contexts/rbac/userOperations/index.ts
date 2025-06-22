
import { User } from '@/types/rbac';
import { UserOperations } from './types';
import { createAddUserOperation } from './addUser';
import { createUpdateUserOperation } from './updateUser';
import { createDeleteUserOperation } from './deleteUser';
import { createChangePasswordOperation } from './changePassword';

export const createUserOperations = (setUsers: React.Dispatch<React.SetStateAction<User[]>>): UserOperations => {
  const addUser = createAddUserOperation(setUsers);
  const updateUser = createUpdateUserOperation(setUsers);
  const deleteUser = createDeleteUserOperation(setUsers);
  const changeUserPassword = createChangePasswordOperation();

  return {
    addUser,
    updateUser,
    deleteUser,
    changeUserPassword,
  };
};

// Re-export types for convenience
export type { UserOperationData, UserOperations } from './types';

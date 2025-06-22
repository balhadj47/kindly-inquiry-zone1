
import { User } from '@/types/rbac';

export interface UserOperationData extends Partial<User> {
  group_id?: number;
}

export interface UserOperations {
  addUser: (userData: UserOperationData) => Promise<void>;
  updateUser: (id: string, userData: UserOperationData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  changeUserPassword: (userEmail: string, newPassword: string) => Promise<void>;
}

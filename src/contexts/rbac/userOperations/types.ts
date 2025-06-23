
import { User } from '@/types/rbac';

export interface UserOperationData extends Partial<User> {
  // Remove group_id reference - only use role_id
}

export interface UserOperations {
  addUser: (userData: UserOperationData) => Promise<User>; // Changed from Promise<void> to Promise<User>
  updateUser: (id: string, userData: UserOperationData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  changeUserPassword: (userEmail: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

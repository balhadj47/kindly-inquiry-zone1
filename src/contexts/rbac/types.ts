
import type { User, UserGroup as Group, Permission, UserRole, UserStatus } from '@/types/rbac';

export interface RBACContextType {
  currentUser: User | null;
  users: User[];
  groups: Group[];
  permissions: Permission[];
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  setUser: (user: User | null) => void;
  addUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: number, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  changeUserPassword: (email: string, newPassword: string) => Promise<void>;
  getUserGroup: (user: User) => Group | undefined;
  addGroup: (groupData: Partial<Group>) => Promise<void>;
  updateGroup: (id: string, groupData: Partial<Group>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
}

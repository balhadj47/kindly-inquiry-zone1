
import { User, Permission } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

// Re-export the main types for consistency
export type RBACUser = User;
export type RBACRole = SystemGroup;
export type RBACPermission = Permission;

export interface RBACState {
  currentUser: User | null;
  users: User[];
  roles: SystemGroup[];
  permissions: Permission[];
  loading: boolean;
}

export interface RBACActions {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>;
  setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface RBACContextType {
  currentUser: User | null;
  users: User[];
  roles: SystemGroup[];
  permissions: Permission[];
  loading: boolean;
  
  // User management
  setUser: (user: User | null) => void;
  addUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  changeUserPassword: (userEmail: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  
  // Role management
  addRole: (roleData: Partial<SystemGroup>) => Promise<void>;
  updateRole: (id: number, roleData: Partial<SystemGroup>) => Promise<SystemGroup>;
  deleteRole: (id: number) => Promise<void>;
  
  // Permission checking
  hasPermission: (permission: string) => boolean;
  getUserRole: (userId: string) => SystemGroup | null;
  canUserPerformAction: (userId: string, action: string) => boolean;
}

export interface RBACProviderProps {
  children: React.ReactNode;
}


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
  permissions: string[]; // Changed from Permission[] to string[]
  loading: boolean;
}

export interface RBACActions {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>;
  setPermissions: React.Dispatch<React.SetStateAction<string[]>>; // Changed from Permission[] to string[]
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface RBACContextType {
  currentUser: User | null;
  users: User[];
  roles: SystemGroup[];
  permissions: string[]; // Changed from Permission[] to string[]
  loading: boolean;
  
  // User management
  setUser: (user: User | null) => void;
  addUser: (userData: Partial<User>) => Promise<User>; // Changed from Promise<void> to Promise<User>
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  changeUserPassword: (userEmail: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  
  // Role management - Fixed to use string IDs and proper return types
  addRole: (roleData: Partial<SystemGroup>) => Promise<void>;
  updateRole: (id: string, roleData: Partial<SystemGroup>) => Promise<SystemGroup>;
  deleteRole: (id: string) => Promise<void>;
  
  // Permission checking
  hasPermission: (permission: string) => boolean;
  getUserRole: (userId: string) => SystemGroup | null;
  canUserPerformAction: (userId: string, action: string) => boolean;
}

export interface RBACProviderProps {
  children: React.ReactNode;
}

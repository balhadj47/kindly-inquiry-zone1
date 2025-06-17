
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
  // State
  currentUser: User | null;
  users: User[];
  roles: SystemGroup[];
  permissions: Permission[];
  loading: boolean;
  
  // User operations
  addUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  changeUserPassword: (userEmail: string, newPassword: string) => Promise<void>;
  
  // Role operations
  addRole: (roleData: Partial<SystemGroup>) => Promise<void>;
  updateRole: (id: string, roleData: Partial<SystemGroup>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  
  // Permission utilities
  hasPermission: (permission: string) => boolean;
  getMenuItemPermissions: () => {
    dashboard: boolean;
    companies: boolean;
    vans: boolean;
    users: boolean;
    tripLogger: boolean;
    tripHistory: boolean;
  };
  
  // User state setter
  setUser: (user: User | null) => void;
}

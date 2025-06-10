
import type { User, Group, Permission } from '@/types/rbac';

export interface RBACContextType {
  // State
  currentUser: User | null;
  users: User[];
  groups: Group[];
  permissions: Permission[];
  loading: boolean;
  
  // User operations
  addUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  changeUserPassword: (userEmail: string, newPassword: string) => Promise<void>;
  
  // Group operations
  addGroup: (groupData: Partial<Group>) => Promise<void>;
  updateGroup: (id: string, groupData: Partial<Group>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  
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

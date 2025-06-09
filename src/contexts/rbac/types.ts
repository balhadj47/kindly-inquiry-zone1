
import type { User, UserGroup, Permission } from '@/types/rbac';

export interface RBACUser extends User {}

export interface RBACGroup extends UserGroup {}

export interface RBACState {
  currentUser: RBACUser | null;
  users: RBACUser[];
  groups: RBACGroup[];
  permissions: Permission[];
  loading: boolean;
  error: Error | null;
}

export type RBACActions = 
  | { type: 'SET_USER'; payload: RBACUser | null }
  | { type: 'SET_USERS'; payload: RBACUser[] }
  | { type: 'SET_GROUPS'; payload: RBACGroup[] }
  | { type: 'SET_PERMISSIONS'; payload: Permission[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null };

export interface RBACContextType {
  currentUser: RBACUser | null;
  users: RBACUser[];
  groups: RBACGroup[];
  permissions: Permission[];
  loading: boolean;
  setUser: (user: RBACUser | null) => void;
  hasPermission: (permission: string) => boolean;
  getMenuItemPermissions: () => {
    dashboard: boolean;
    companies: boolean;
    vans: boolean;
    users: boolean;
    tripLogger: boolean;
    tripHistory: boolean;
  };
  addUser: (userData: any) => Promise<void>;
  updateUser: (userId: string, userData: any) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addGroup: (groupData: any) => Promise<void>;
  updateGroup: (groupId: string, groupData: any) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  changeUserPassword: (email: string, newPassword: string) => Promise<void>;
}

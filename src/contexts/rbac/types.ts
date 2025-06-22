import { User, Role, Permission } from '@/types/rbac';

export interface RBACContextType {
  currentUser: User | null;
  users: User[];
  roles: Role[];
  permissions: Permission[];
  loading: boolean;
  
  // User management
  setUser: (user: User | null) => void;
  addUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  changeUserPassword: (userEmail: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  
  // Role management
  addRole: (roleData: Partial<Role>) => Promise<void>;
  updateRole: (id: number, roleData: Partial<Role>) => Promise<Role>;
  deleteRole: (id: number) => Promise<void>;
  
  // Permission checking
  hasPermission: (permission: string) => boolean;
  getUserRole: (userId: string) => Role | null;
  canUserPerformAction: (userId: string, action: string) => boolean;
}

export interface RBACProviderProps {
  children: React.ReactNode;
}

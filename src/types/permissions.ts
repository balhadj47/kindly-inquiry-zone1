
export interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
  created_at: string;
}

export interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
  granted_at: string;
}

export interface PermissionCategory {
  name: string;
  permissions: Permission[];
}

export const PERMISSION_CATEGORIES = [
  'dashboard',
  'companies',
  'vans',
  'users',
  'trips',
  'auth-users',
  'groups'
] as const;

export type PermissionCategoryType = typeof PERMISSION_CATEGORIES[number];

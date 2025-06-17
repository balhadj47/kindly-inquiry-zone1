
import { SystemGroupName } from '@/types/systemGroups';

// Permission mappings for system groups
export const ROLE_PERMISSIONS: Record<SystemGroupName, string[]> = {
  'Administrator': [
    'users:read', 'users:create', 'users:update', 'users:delete',
    'vans:read', 'vans:create', 'vans:update', 'vans:delete',
    'trips:read', 'trips:create', 'trips:update', 'trips:delete',
    'companies:read', 'companies:create', 'companies:update', 'companies:delete',
    'groups:read', 'groups:manage',
    'dashboard:read', 'settings:read', 'settings:update'
  ],
  'Supervisor': [
    'users:read', 'users:update',
    'vans:read', 'vans:update',
    'trips:read', 'trips:create', 'trips:update',
    'companies:read',
    'groups:read',
    'dashboard:read'
  ],
  'Employee': [
    'dashboard:read',
    'trips:read', 'trips:create',
    'companies:read',
    'vans:read'
  ]
};

// Default permissions for unknown roles
export const DEFAULT_PERMISSIONS: string[] = ['dashboard:read'];

// Helper function to get permissions for a role
export const getPermissionsForRole = (systemGroup: SystemGroupName): string[] => {
  return ROLE_PERMISSIONS[systemGroup] || DEFAULT_PERMISSIONS;
};

// Check if a role has a specific permission
export const roleHasPermission = (systemGroup: SystemGroupName, permission: string): boolean => {
  const rolePermissions = getPermissionsForRole(systemGroup);
  return rolePermissions.includes(permission);
};

// Role display names and colors
export const ROLE_DISPLAY_INFO: Record<SystemGroupName, { name: string; color: string }> = {
  'Administrator': { name: 'Administrateur', color: '#dc2626' },
  'Supervisor': { name: 'Superviseur', color: '#ea580c' },
  'Employee': { name: 'Employé', color: '#3b82f6' }
};

// Helper function to get role display name
export const getRoleDisplayName = (systemGroup: SystemGroupName): string => {
  return ROLE_DISPLAY_INFO[systemGroup]?.name || systemGroup;
};

// Helper function to get role color
export const getRoleColor = (systemGroup: SystemGroupName): string => {
  return ROLE_DISPLAY_INFO[systemGroup]?.color || '#6b7280';
};

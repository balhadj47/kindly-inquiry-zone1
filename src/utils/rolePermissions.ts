
import { SystemGroupName } from '@/types/systemGroups';

// Permission mappings for role_id (1=Administrator, 2=Supervisor, 3=Employee)
export const ROLE_ID_PERMISSIONS: Record<number, string[]> = {
  1: [ // Administrator
    'users:read', 'users:create', 'users:update', 'users:delete',
    'vans:read', 'vans:create', 'vans:update', 'vans:delete',
    'trips:read', 'trips:create', 'trips:update', 'trips:delete',
    'companies:read', 'companies:create', 'companies:update', 'companies:delete',
    'groups:read', 'groups:manage',
    'dashboard:read', 'settings:read', 'settings:update'
  ],
  2: [ // Supervisor
    'users:read', 'users:update',
    'vans:read', 'vans:update',
    'trips:read', 'trips:create', 'trips:update',
    'companies:read',
    'groups:read',
    'dashboard:read'
  ],
  3: [ // Employee
    'dashboard:read',
    'trips:read', 'trips:create',
    'companies:read',
    'vans:read'
  ]
};

// Legacy permission mappings for systemGroup names
export const ROLE_PERMISSIONS: Record<SystemGroupName, string[]> = {
  'Administrator': ROLE_ID_PERMISSIONS[1],
  'Supervisor': ROLE_ID_PERMISSIONS[2],
  'Employee': ROLE_ID_PERMISSIONS[3]
};

// Default permissions for unknown roles
export const DEFAULT_PERMISSIONS: string[] = ['dashboard:read'];

// Helper function to get permissions for a role_id
export const getPermissionsForRoleId = (roleId: number): string[] => {
  console.log('🔐 getPermissionsForRoleId called with roleId:', roleId);
  const permissions = ROLE_ID_PERMISSIONS[roleId] || DEFAULT_PERMISSIONS;
  console.log('🔐 Permissions for role_id', roleId, ':', permissions);
  return permissions;
};

// Helper function to get permissions for a role name (backward compatibility)
export const getPermissionsForRole = (systemGroup: SystemGroupName): string[] => {
  return ROLE_PERMISSIONS[systemGroup] || DEFAULT_PERMISSIONS;
};

// Check if a role_id has a specific permission
export const roleIdHasPermission = (roleId: number, permission: string): boolean => {
  console.log('🔐 roleIdHasPermission called with roleId:', roleId, 'permission:', permission);
  const rolePermissions = getPermissionsForRoleId(roleId);
  const hasPermission = rolePermissions.includes(permission);
  console.log('🔐 Role', roleId, 'has permission', permission, ':', hasPermission);
  return hasPermission;
};

// Check if a role has a specific permission (backward compatibility)
export const roleHasPermission = (systemGroup: SystemGroupName, permission: string): boolean => {
  const rolePermissions = getPermissionsForRole(systemGroup);
  return rolePermissions.includes(permission);
};

// Role display names and colors by role_id
export const ROLE_ID_DISPLAY_INFO: Record<number, { name: string; color: string }> = {
  1: { name: 'Administrateur', color: '#dc2626' },
  2: { name: 'Superviseur', color: '#ea580c' },
  3: { name: 'Employé', color: '#3b82f6' }
};

// Role display names and colors by name (backward compatibility)
export const ROLE_DISPLAY_INFO: Record<SystemGroupName, { name: string; color: string }> = {
  'Administrator': ROLE_ID_DISPLAY_INFO[1],
  'Supervisor': ROLE_ID_DISPLAY_INFO[2],
  'Employee': ROLE_ID_DISPLAY_INFO[3]
};

// Helper function to get role display name by role_id
export const getRoleDisplayNameById = (roleId: number): string => {
  return ROLE_ID_DISPLAY_INFO[roleId]?.name || 'Employé';
};

// Helper function to get role display name (backward compatibility)
export const getRoleDisplayName = (systemGroup: SystemGroupName): string => {
  return ROLE_DISPLAY_INFO[systemGroup]?.name || systemGroup;
};

// Helper function to get role color by role_id
export const getRoleColorById = (roleId: number): string => {
  return ROLE_ID_DISPLAY_INFO[roleId]?.color || '#6b7280';
};

// Helper function to get role color (backward compatibility)
export const getRoleColor = (systemGroup: SystemGroupName): string => {
  return ROLE_DISPLAY_INFO[systemGroup]?.color || '#6b7280';
};

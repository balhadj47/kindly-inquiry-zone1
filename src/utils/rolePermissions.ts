
import { UserRole } from '@/types/rbac';

export const ROLE_PERMISSION_MAPPING: Record<UserRole, string[]> = {
  'Administrator': [
    'users:read', 'users:create', 'users:update', 'users:delete',
    'groups:read', 'groups:create', 'groups:update', 'groups:delete',
    'vans:read', 'vans:create', 'vans:update', 'vans:delete',
    'trips:read', 'trips:create', 'trips:update', 'trips:delete',
    'companies:read', 'companies:create', 'companies:update', 'companies:delete',
    'dashboard:read', 'settings:read', 'settings:update'
  ],
  'Employee': [
    'dashboard:read',
    'trips:read',
    'vans:read',
    'companies:read'
  ],
  'Chef de Groupe Armé': [
    'users:read', 'users:update',
    'vans:read', 'vans:update',
    'trips:read', 'trips:create', 'trips:update',
    'companies:read',
    'dashboard:read'
  ],
  'Chef de Groupe Sans Armé': [
    'users:read', 'users:update',
    'vans:read', 'vans:update',
    'trips:read', 'trips:create', 'trips:update',
    'companies:read',
    'dashboard:read'
  ],
  'Chauffeur Armé': [
    'trips:read', 'trips:create',
    'vans:read',
    'companies:read',
    'dashboard:read'
  ],
  'Chauffeur Sans Armé': [
    'trips:read', 'trips:create',
    'vans:read',
    'companies:read',
    'dashboard:read'
  ],
  'APS Armé': [
    'trips:read',
    'vans:read',
    'companies:read',
    'dashboard:read'
  ],
  'APS Sans Armé': [
    'trips:read',
    'vans:read',
    'companies:read',
    'dashboard:read'
  ]
};

export const getDefaultPermissionsForRole = (role: UserRole): string[] => {
  return ROLE_PERMISSION_MAPPING[role] || [];
};

export const suggestGroupForRole = (role: UserRole): string => {
  const roleToGroupMapping: Record<UserRole, string> = {
    'Administrator': 'administrator',
    'Employee': 'employee',
    'Chef de Groupe Armé': 'supervisor',
    'Chef de Groupe Sans Armé': 'supervisor',
    'Chauffeur Armé': 'driver',
    'Chauffeur Sans Armé': 'driver',
    'APS Armé': 'security',
    'APS Sans Armé': 'security'
  };
  
  return roleToGroupMapping[role] || 'employee';
};

export const validateRolePermissions = (role: UserRole, permissions: string[]): {
  isValid: boolean;
  missingPermissions: string[];
  extraPermissions: string[];
} => {
  const expectedPermissions = getDefaultPermissionsForRole(role);
  const missingPermissions = expectedPermissions.filter(p => !permissions.includes(p));
  const extraPermissions = permissions.filter(p => !expectedPermissions.includes(p));
  
  return {
    isValid: missingPermissions.length === 0 && extraPermissions.length === 0,
    missingPermissions,
    extraPermissions
  };
};

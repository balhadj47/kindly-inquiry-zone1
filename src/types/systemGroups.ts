
export type SystemGroupName = 
  | 'Administrator'
  | 'Supervisor' 
  | 'Employee';

export interface SystemGroup {
  id: string;
  name: SystemGroupName;
  description: string;
  permissions: string[];
  color: string;
  isSystemRole: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const DEFAULT_SYSTEM_GROUPS: SystemGroup[] = [
  {
    id: '1',
    name: 'Administrator',
    permissions: [
      'users:read', 'users:create', 'users:update', 'users:delete',
      'vans:read', 'vans:create', 'vans:update', 'vans:delete',
      'trips:read', 'trips:create', 'trips:update', 'trips:delete',
      'companies:read', 'companies:create', 'companies:update', 'companies:delete',
      'missions:read', 'missions:create', 'missions:update', 'missions:delete',
      'groups:read', 'groups:manage',
      'dashboard:read', 'settings:read', 'settings:update'
    ],
    description: 'Accès complet au système',
    color: '#dc2626',
    isSystemRole: true,
  },
  {
    id: '2',
    name: 'Supervisor',
    permissions: [
      'users:read',
      'vans:read',
      'trips:read',
      'missions:read',
      'companies:read',
      'groups:read',
      'dashboard:read'
    ],
    description: 'Accès superviseur',
    color: '#ea580c',
    isSystemRole: true,
  },
  {
    id: '3',
    name: 'Employee',
    permissions: [
      'dashboard:read',
      'trips:read', 'trips:create',
      'missions:read', 'missions:create',
      'companies:read',
      'vans:read'
    ],
    description: 'Accès employé standard',
    color: '#3b82f6',
    isSystemRole: true,
  }
];

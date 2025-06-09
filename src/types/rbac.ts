export type UserRole = 'Administrator' | 'Employee' | 'Chef de Groupe Armé' | 'Chef de Groupe Sans Armé' | 'Chauffeur Armé' | 'Chauffeur Sans Armé' | 'APS Armé' | 'APS Sans Armé';

export type UserStatus = 'Active' | 'Récupération' | 'Congé' | 'Congé maladie';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'companies' | 'vans' | 'users' | 'trips' | 'settings';
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

export interface User {
  id: string; // Changed from number to string for consistency
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  groupId: string;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  // Driver-specific fields (for backward compatibility)
  licenseNumber?: string;
  totalTrips?: number;
  lastTrip?: string;
}

// Only admin and employee as default groups
export const DEFAULT_PERMISSIONS: Permission[] = [
  // Dashboard permissions
  { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to main dashboard', category: 'dashboard' },
  { id: 'dashboard.analytics', name: 'View Analytics', description: 'Access to analytics and reports', category: 'dashboard' },
  
  // Companies permissions
  { id: 'companies.view', name: 'View Companies', description: 'View companies list', category: 'companies' },
  { id: 'companies.create', name: 'Create Companies', description: 'Add new companies', category: 'companies' },
  { id: 'companies.edit', name: 'Edit Companies', description: 'Modify company information', category: 'companies' },
  { id: 'companies.delete', name: 'Delete Companies', description: 'Remove companies', category: 'companies' },
  
  // Vans permissions
  { id: 'vans.view', name: 'View Vans', description: 'View vans list', category: 'vans' },
  { id: 'vans.create', name: 'Create Vans', description: 'Add new vans', category: 'vans' },
  { id: 'vans.edit', name: 'Edit Vans', description: 'Modify van information', category: 'vans' },
  { id: 'vans.delete', name: 'Delete Vans', description: 'Remove vans', category: 'vans' },
  
  // Users permissions
  { id: 'users.view', name: 'View Users', description: 'View users list', category: 'users' },
  { id: 'users.create', name: 'Create Users', description: 'Add new users', category: 'users' },
  { id: 'users.edit', name: 'Edit Users', description: 'Modify user information', category: 'users' },
  { id: 'users.delete', name: 'Delete Users', description: 'Remove users', category: 'users' },
  { id: 'users.manage_groups', name: 'Manage Groups', description: 'Create and edit user groups', category: 'users' },
  
  // Trips permissions
  { id: 'trips.view', name: 'View Trips', description: 'View trip history', category: 'trips' },
  { id: 'trips.log', name: 'Log Trips', description: 'Create new trip entries', category: 'trips' },
  { id: 'trips.edit', name: 'Edit Trips', description: 'Modify trip information', category: 'trips' },
  { id: 'trips.delete', name: 'Delete Trips', description: 'Remove trip entries', category: 'trips' },
  
  // Settings permissions
  { id: 'settings.view', name: 'View Settings', description: 'Access system settings', category: 'settings' },
  { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings', category: 'settings' },
];

// Only admin and employee as default groups
export const DEFAULT_GROUPS: UserGroup[] = [
  {
    id: 'admin',
    name: 'Administrateurs',
    description: 'Accès complet au système avec toutes les permissions',
    color: 'bg-red-100 text-red-800',
    permissions: DEFAULT_PERMISSIONS.map(p => p.id),
  },
  {
    id: 'employee',
    name: 'Employés',
    description: 'Accès de base pour les employés',
    color: 'bg-blue-100 text-blue-800',
    permissions: ['dashboard.view', 'companies.view', 'vans.view', 'users.view', 'trips.view'],
  },
];

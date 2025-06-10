
import { supabase } from '@/integrations/supabase/client';
import type { User, Group, Permission, UserRole, UserStatus } from '@/types/rbac';
import { AVAILABLE_PERMISSIONS } from '@/types/rbac';

// Create role-based groups from user roles
const createRoleBasedGroups = (): Group[] => {
  return [
    {
      id: 'Administrator',
      name: 'Administrateurs',
      description: 'Accès complet au système',
      color: '#DC2626',
      permissions: AVAILABLE_PERMISSIONS.map(p => p.id), // All permissions
    },
    {
      id: 'Employee',
      name: 'Employés',
      description: 'Accès de base pour les employés',
      color: '#3B82F6',
      permissions: [
        'dashboard:read',
        'companies:read',
        'vans:read',
        'trips:read',
        'trips:create',
      ],
    },
    {
      id: 'Chef de Groupe Armé',
      name: 'Chefs de Groupe Armés',
      description: 'Gestion des équipes armées',
      color: '#DC2626',
      permissions: [
        'dashboard:read',
        'companies:read',
        'vans:read',
        'vans:update',
        'trips:read',
        'trips:create',
        'trips:update',
        'users:read',
      ],
    },
    {
      id: 'Chef de Groupe Sans Armé',
      name: 'Chefs de Groupe Sans Armé',
      description: 'Gestion des équipes non armées',
      color: '#F59E0B',
      permissions: [
        'dashboard:read',
        'companies:read',
        'vans:read',
        'trips:read',
        'trips:create',
        'trips:update',
        'users:read',
      ],
    },
    {
      id: 'Chauffeur Armé',
      name: 'Chauffeurs Armés',
      description: 'Conduite avec protection armée',
      color: '#EF4444',
      permissions: [
        'dashboard:read',
        'trips:read',
        'trips:create',
        'vans:read',
      ],
    },
    {
      id: 'Chauffeur Sans Armé',
      name: 'Chauffeurs Sans Armé',
      description: 'Conduite sans protection armée',
      color: '#F97316',
      permissions: [
        'dashboard:read',
        'trips:read',
        'trips:create',
        'vans:read',
      ],
    },
    {
      id: 'APS Armé',
      name: 'Agents de Sécurité Armés',
      description: 'Sécurité avec port d\'arme',
      color: '#DC2626',
      permissions: [
        'dashboard:read',
        'trips:read',
        'companies:read',
      ],
    },
    {
      id: 'APS Sans Armé',
      name: 'Agents de Sécurité Sans Armé',
      description: 'Sécurité sans port d\'arme',
      color: '#F59E0B',
      permissions: [
        'dashboard:read',
        'trips:read',
        'companies:read',
      ],
    },
  ];
};

export const loadUserData = async (): Promise<User> => {
  console.log('Loading current user data...');
  
  const { data, error } = await supabase.rpc('get_current_user_rbac');
  
  if (error) {
    console.error('Error loading user data:', error);
    throw error;
  }
  
  if (!data) {
    throw new Error('No user data found');
  }
  
  const user: User = {
    id: data.id.toString(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    groupId: data.role, // Use role as groupId
    role: data.role as UserRole,
    status: data.status as UserStatus,
    createdAt: data.created_at,
    totalTrips: data.total_trips,
    lastTrip: data.last_trip,
    profileImage: data.profile_image,
  };
  
  console.log('User data loaded:', user);
  return user;
};

export const loadUsersData = async (): Promise<User[]> => {
  console.log('Loading users data...');
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading users:', error);
    throw error;
  }
  
  const users: User[] = (data || []).map(user => ({
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    groupId: user.role, // Use role as groupId
    role: user.role as UserRole,
    status: user.status as UserStatus,
    createdAt: user.created_at,
    totalTrips: user.total_trips,
    lastTrip: user.last_trip,
    profileImage: user.profile_image,
  }));
  
  console.log('Users data loaded:', users.length, 'users');
  return users;
};

export const loadGroupsData = async (): Promise<Group[]> => {
  console.log('Loading groups data...');
  
  // Return role-based groups instead of database groups
  const groups = createRoleBasedGroups();
  
  console.log('Groups data loaded:', groups.length, 'groups');
  return groups;
};

export const loadPermissionsData = async (): Promise<Permission[]> => {
  console.log('Loading permissions data...');
  
  // Return static permissions
  const permissions = AVAILABLE_PERMISSIONS;
  
  console.log('Permissions data loaded:', permissions.length, 'permissions');
  return permissions;
};

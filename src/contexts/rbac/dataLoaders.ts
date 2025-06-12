
import { supabase } from '@/integrations/supabase/client';
import type { User, Group, Permission, UserRole, UserStatus } from '@/types/rbac';
import { DEFAULT_PERMISSIONS } from '@/types/rbac';

// Mock groups data for development
const MOCK_GROUPS: Group[] = [
  {
    id: 'admin',
    name: 'Administrateurs',
    description: 'Accès complet au système',
    permissions: [
      'users:read', 'users:create', 'users:update', 'users:delete',
      'groups:read', 'groups:create', 'groups:update', 'groups:delete',
      'vans:read', 'vans:create', 'vans:update', 'vans:delete',
      'trips:read', 'trips:create', 'trips:update', 'trips:delete',
      'companies:read', 'companies:create', 'companies:update', 'companies:delete',
      'dashboard:read', 'settings:read', 'settings:update'
    ],
    color: 'bg-red-100 text-red-800',
  },
  {
    id: 'employee',
    name: 'Employés',
    description: 'Accès de base pour les employés',
    permissions: [
      'dashboard:read', 'trips:read', 'trips:create', 
      'companies:read', 'vans:read'
    ],
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'driver',
    name: 'Chauffeurs',
    description: 'Accès pour les chauffeurs',
    permissions: [
      'dashboard:read', 'trips:read', 'trips:create', 
      'companies:read', 'vans:read'
    ],
    color: 'bg-green-100 text-green-800',
  },
];

// Mock users data for development
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+33123456789',
    role: 'Administrator',
    status: 'Active',
    groupId: 'admin',
    createdAt: new Date().toISOString(),
    totalTrips: 25,
    lastTrip: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33987654321',
    role: 'Employee',
    status: 'Active',
    groupId: 'employee',
    createdAt: new Date().toISOString(),
    totalTrips: 12,
    lastTrip: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    phone: '+33456789123',
    role: 'Chauffeur Armé',
    status: 'Active',
    groupId: 'driver',
    createdAt: new Date().toISOString(),
    totalTrips: 34,
    lastTrip: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export const loadInitialData = async (authUser: any) => {
  console.log('Loading initial RBAC data for user:', authUser?.id);
  
  try {
    // For now, use mock data since we don't have the database tables set up
    const users = MOCK_USERS;
    const groups = MOCK_GROUPS;
    const permissions = DEFAULT_PERMISSIONS;
    
    // Find current user - in development, use the first admin user
    let currentUser = users.find(user => user.groupId === 'admin') || users[0] || null;
    
    console.log('Mock data loaded successfully:', {
      usersCount: users.length,
      groupsCount: groups.length,
      permissionsCount: permissions.length,
      currentUser: currentUser?.id
    });
    
    return {
      users,
      groups,
      permissions,
      currentUser,
    };
  } catch (error) {
    console.error('Error loading RBAC data:', error);
    return {
      users: [],
      groups: [],
      permissions: DEFAULT_PERMISSIONS,
      currentUser: null,
    };
  }
};

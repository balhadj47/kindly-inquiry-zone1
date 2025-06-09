
import { supabase } from '@/integrations/supabase/client';
import { RBACUser, RBACGroup } from './types';

export const loadUserData = async (): Promise<RBACUser | null> => {
  try {
    console.log('Loading user data...');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    if (!user) {
      console.log('No authenticated user found');
      return null;
    }

    console.log('Authenticated user:', user);

    // For now, create a mock user based on the authenticated user
    // In a real app, you'd fetch from a users table
    const rbacUser: RBACUser = {
      id: parseInt(user.id.slice(-8), 16), // Convert part of UUID to number
      name: user.email?.split('@')[0] || 'User',
      email: user.email || '',
      role: 'Admin' as any, // Type assertion for now
      status: 'Active' as any, // Type assertion for now
      groupId: 1,
      createdAt: user.created_at || new Date().toISOString(),
    };

    console.log('Created RBAC user:', rbacUser);
    return rbacUser;
  } catch (error) {
    console.error('Error loading user data:', error);
    throw error;
  }
};

export const loadUsersData = async (): Promise<RBACUser[]> => {
  try {
    // For now, return mock data
    // In a real app, you'd fetch from a users table
    return [];
  } catch (error) {
    console.error('Error loading users data:', error);
    throw error;
  }
};

export const loadGroupsData = async (): Promise<RBACGroup[]> => {
  try {
    console.log('Loading groups data...');
    
    // Mock groups data with proper permissions
    const groups: RBACGroup[] = [
      {
        id: 1,
        name: 'Administrators',
        description: 'Full system access',
        permissions: [
          'dashboard.view',
          'companies.view',
          'companies.create',
          'companies.edit',
          'companies.delete',
          'vans.view',
          'vans.create',
          'vans.edit',
          'vans.delete',
          'users.view',
          'users.create',
          'users.edit',
          'users.delete',
          'trips.log',
          'trips.view',
          'trips.edit',
          'trips.delete'
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Managers',
        description: 'Management access',
        permissions: [
          'dashboard.view',
          'companies.view',
          'companies.create',
          'companies.edit',
          'vans.view',
          'vans.edit',
          'users.view',
          'trips.log',
          'trips.view'
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Operators',
        description: 'Basic operational access',
        permissions: [
          'dashboard.view',
          'companies.view',
          'vans.view',
          'trips.log',
          'trips.view'
        ],
        createdAt: new Date().toISOString(),
      }
    ];

    console.log('Loaded groups:', groups);
    return groups;
  } catch (error) {
    console.error('Error loading groups data:', error);
    throw error;
  }
};

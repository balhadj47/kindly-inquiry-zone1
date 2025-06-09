import { supabase } from '@/integrations/supabase/client';
import { RBACUser, RBACGroup } from './types';
import { DEFAULT_PERMISSIONS } from '@/types/rbac';

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

    // Try to get user from database first
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      console.error('Database error:', dbError);
      throw dbError;
    }

    if (dbUser) {
      console.log('Found user in database:', dbUser);
      const rbacUser: RBACUser = {
        id: dbUser.id.toString(), // Convert numeric ID to string
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        role: dbUser.role as any,
        status: dbUser.status as any,
        groupId: dbUser.group_id,
        createdAt: dbUser.created_at,
        licenseNumber: dbUser.license_number,
        totalTrips: dbUser.total_trips,
        lastTrip: dbUser.last_trip,
      };
      console.log('Created RBAC user from database:', rbacUser);
      return rbacUser;
    } else {
      console.log('User not found in database, creating mock user');
      // Create mock user for testing
      const rbacUser: RBACUser = {
        id: user.id.slice(-8), // Use last 8 chars of UUID as string ID
        name: user.email?.split('@')[0] || 'User',
        email: user.email || '',
        phone: '',
        role: 'Administrator' as any,
        status: 'Active' as any,
        groupId: 'admin', // Use string ID instead of number
        createdAt: user.created_at || new Date().toISOString(),
      };

      console.log('Created mock RBAC user:', rbacUser);
      return rbacUser;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    throw error;
  }
};

export const loadUsersData = async (): Promise<RBACUser[]> => {
  try {
    console.log('Loading users data...');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading users:', error);
      return [];
    }

    console.log('Loaded users from database:', users);
    
    const rbacUsers: RBACUser[] = users.map(user => ({
      id: user.id.toString(), // Convert numeric ID to string
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as any,
      status: user.status as any,
      groupId: user.group_id,
      createdAt: user.created_at,
      licenseNumber: user.license_number,
      totalTrips: user.total_trips,
      lastTrip: user.last_trip,
    }));

    console.log('Converted to RBAC users:', rbacUsers);
    return rbacUsers;
  } catch (error) {
    console.error('Error loading users data:', error);
    return [];
  }
};

export const loadGroupsData = async (): Promise<RBACGroup[]> => {
  try {
    console.log('Loading groups data...');
    
    // Define default groups
    const defaultGroups: RBACGroup[] = [
      {
        id: 'admin',
        name: 'Administrators',
        description: 'Full system access',
        color: 'bg-red-100 text-red-800',
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
          'users.manage_groups',
          'trips.log',
          'trips.view',
          'trips.edit',
          'trips.delete'
        ],
      },
      {
        id: 'employee',
        name: 'Employees',
        description: 'Basic operational access',
        color: 'bg-blue-100 text-blue-800',
        permissions: [
          'dashboard.view',
          'companies.view',
          'vans.view',
          'users.view',
          'trips.log',
          'trips.view'
        ],
      }
    ];

    // Try to load from database
    const { data: dbGroups, error } = await supabase
      .from('user_groups')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading groups from database:', error);
      console.log('Returning default groups only');
      return defaultGroups;
    }

    // Convert database groups and filter out any that have the same ID as default groups
    const dbGroupsConverted: RBACGroup[] = dbGroups ? dbGroups
      .filter(group => !defaultGroups.some(defaultGroup => defaultGroup.id === group.id))
      .map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        color: group.color,
        permissions: Array.isArray(group.permissions) ? group.permissions : [],
      })) : [];

    // Combine default groups with database groups (no duplicates)
    const allGroups = [...defaultGroups, ...dbGroupsConverted];
    
    console.log('Final groups loaded:', allGroups);
    return allGroups;
  } catch (error) {
    console.error('Error loading groups data:', error);
    // Return default groups as fallback
    return [
      {
        id: 'admin',
        name: 'Administrators',
        description: 'Full system access',
        color: 'bg-red-100 text-red-800',
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
          'users.manage_groups',
          'trips.log',
          'trips.view',
          'trips.edit',
          'trips.delete'
        ],
      }
    ];
  }
};

export const loadPermissionsData = async () => {
  console.log('Loading permissions data...');
  console.log('Returning default permissions:', DEFAULT_PERMISSIONS);
  return DEFAULT_PERMISSIONS;
};

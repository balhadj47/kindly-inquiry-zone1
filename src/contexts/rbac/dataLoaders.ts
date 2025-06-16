
import { supabase } from '@/integrations/supabase/client';
import { User, Role } from '@/types/rbac';

export const loadUsers = async (): Promise<User[]> => {
  try {
    console.log('🔄 Loading users from database...');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading users:', error);
      return [];
    }

    console.log('✅ Users loaded successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Exception loading users:', error);
    return [];
  }
};

export const loadRoles = async (): Promise<Role[]> => {
  try {
    console.log('🔄 Loading roles from database...');
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) {
      console.error('❌ Error loading roles:', error);
      // Return default roles if database query fails
      console.log('🔄 Falling back to default roles...');
      return getDefaultRoles();
    }

    const roles = data || [];
    console.log('✅ Roles loaded successfully:', roles.length);
    
    // If no roles in database, create default ones
    if (roles.length === 0) {
      console.log('🔄 No roles found, creating default roles...');
      return await createDefaultRoles();
    }

    return roles;
  } catch (error) {
    console.error('❌ Exception loading roles:', error);
    console.log('🔄 Falling back to default roles...');
    return getDefaultRoles();
  }
};

const getDefaultRoles = (): Role[] => {
  return [
    {
      id: '1',
      name: 'Administrator',
      permissions: [
        'users:read', 'users:create', 'users:update', 'users:delete',
        'vans:read', 'vans:create', 'vans:update', 'vans:delete',
        'trips:read', 'trips:create', 'trips:update', 'trips:delete',
        'companies:read', 'companies:create', 'companies:update', 'companies:delete',
        'dashboard:read', 'settings:read', 'settings:update'
      ],
      description: 'Full system access'
    },
    {
      id: '2',
      name: 'Supervisor',
      permissions: [
        'users:read', 'users:update',
        'vans:read', 'vans:update',
        'trips:read', 'trips:create', 'trips:update',
        'companies:read',
        'dashboard:read'
      ],
      description: 'Supervisory access'
    },
    {
      id: '3',
      name: 'Driver',
      permissions: [
        'trips:read', 'trips:create',
        'vans:read',
        'companies:read',
        'dashboard:read'
      ],
      description: 'Driver access'
    },
    {
      id: '4',
      name: 'Employee',
      permissions: [
        'dashboard:read',
        'trips:read',
        'companies:read'
      ],
      description: 'Basic employee access'
    }
  ];
};

const createDefaultRoles = async (): Promise<Role[]> => {
  try {
    const defaultRoles = getDefaultRoles();
    
    const { data, error } = await supabase
      .from('roles')
      .insert(defaultRoles)
      .select();

    if (error) {
      console.error('❌ Error creating default roles:', error);
      return defaultRoles; // Return local defaults if database insert fails
    }

    console.log('✅ Default roles created successfully');
    return data || defaultRoles;
  } catch (error) {
    console.error('❌ Exception creating default roles:', error);
    return getDefaultRoles(); // Return local defaults
  }
};

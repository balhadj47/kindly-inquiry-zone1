
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

    // Transform the database data to match our User interface
    const users: User[] = (data || []).map(user => ({
      id: user.id.toString(),
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role as any,
      status: user.status as any,
      createdAt: user.created_at,
      totalTrips: user.total_trips || 0,
      lastTrip: user.last_trip,
      profileImage: user.profile_image,
    }));

    console.log('✅ Users loaded successfully:', users.length);
    return users;
  } catch (error) {
    console.error('❌ Exception loading users:', error);
    return [];
  }
};

export const loadRoles = async (): Promise<Role[]> => {
  try {
    console.log('🔄 Loading roles from database...');
    const { data, error } = await supabase
      .from('user_groups')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Error loading roles from database:', error);
      console.log('🔄 Falling back to default roles...');
      return getDefaultRoles();
    }

    if (!data || data.length === 0) {
      console.log('🔄 No roles found in database, creating default roles...');
      await createDefaultRoles();
      // Retry loading after creating defaults
      const { data: retryData, error: retryError } = await supabase
        .from('user_groups')
        .select('*')
        .order('name', { ascending: true });
      
      if (retryError || !retryData) {
        console.log('🔄 Fallback to hardcoded default roles...');
        return getDefaultRoles();
      }
      
      return transformDatabaseRolesToRoles(retryData);
    }

    const roles = transformDatabaseRolesToRoles(data);
    console.log('✅ Roles loaded from database:', roles.length);
    return roles;
  } catch (error) {
    console.error('❌ Exception loading roles:', error);
    console.log('🔄 Falling back to default roles...');
    return getDefaultRoles();
  }
};

const transformDatabaseRolesToRoles = (data: any[]): Role[] => {
  return data.map(group => ({
    id: group.id,
    name: group.name,
    description: group.description,
    permissions: Array.isArray(group.permissions) ? group.permissions : [],
    color: group.color,
    isSystemRole: true, // All roles from database are considered system roles
  }));
};

const createDefaultRoles = async (): Promise<void> => {
  try {
    console.log('🔄 Creating default roles in database...');
    const defaultRoles = getDefaultRoles();
    
    for (const role of defaultRoles) {
      const { error } = await supabase
        .from('user_groups')
        .insert({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          color: role.color,
        });
      
      if (error) {
        console.error(`❌ Error creating role ${role.name}:`, error);
      } else {
        console.log(`✅ Created role: ${role.name}`);
      }
    }
  } catch (error) {
    console.error('❌ Exception creating default roles:', error);
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
        'groups:read', 'groups:manage',
        'dashboard:read', 'settings:read', 'settings:update'
      ],
      description: 'Full system access',
      color: '#dc2626',
      isSystemRole: true,
    },
    {
      id: '2',
      name: 'Supervisor',
      permissions: [
        'users:read', 'users:update',
        'vans:read', 'vans:update',
        'trips:read', 'trips:create', 'trips:update',
        'companies:read',
        'groups:read',
        'dashboard:read'
      ],
      description: 'Supervisory access',
      color: '#ea580c',
      isSystemRole: true,
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
      description: 'Driver access',
      color: '#059669',
      isSystemRole: true,
    },
    {
      id: '4',
      name: 'Employee',
      permissions: [
        'dashboard:read',
        'trips:read',
        'companies:read'
      ],
      description: 'Basic employee access',
      color: '#3b82f6',
      isSystemRole: true,
    },
    {
      id: '5',
      name: 'Security',
      permissions: [
        'trips:read', 'trips:create',
        'companies:read',
        'dashboard:read'
      ],
      description: 'Security personnel access',
      color: '#7c3aed',
      isSystemRole: true,
    },
    {
      id: '6',
      name: 'Chef de Groupe Armé',
      permissions: [
        'users:read', 'users:update',
        'trips:read', 'trips:create', 'trips:update',
        'vans:read',
        'companies:read',
        'dashboard:read'
      ],
      description: 'Armed group leader access',
      color: '#be123c',
      isSystemRole: true,
    },
    {
      id: '7',
      name: 'Chef de Groupe Sans Armé',
      permissions: [
        'users:read', 'users:update',
        'trips:read', 'trips:create', 'trips:update',
        'vans:read',
        'companies:read',
        'dashboard:read'
      ],
      description: 'Unarmed group leader access',
      color: '#c2410c',
      isSystemRole: true,
    },
    {
      id: '8',
      name: 'Chauffeur Armé',
      permissions: [
        'trips:read', 'trips:create',
        'vans:read',
        'companies:read',
        'dashboard:read'
      ],
      description: 'Armed driver access',
      color: '#15803d',
      isSystemRole: true,
    },
    {
      id: '9',
      name: 'Chauffeur Sans Armé',
      permissions: [
        'trips:read', 'trips:create',
        'vans:read',
        'companies:read',
        'dashboard:read'
      ],
      description: 'Unarmed driver access',
      color: '#16a34a',
      isSystemRole: true,
    },
    {
      id: '10',
      name: 'APS Armé',
      permissions: [
        'trips:read', 'trips:create',
        'companies:read',
        'dashboard:read'
      ],
      description: 'Armed security agent access',
      color: '#9333ea',
      isSystemRole: true,
    },
    {
      id: '11',
      name: 'APS Sans Armé',
      permissions: [
        'trips:read', 'trips:create',
        'companies:read',
        'dashboard:read'
      ],
      description: 'Unarmed security agent access',
      color: '#a855f7',
      isSystemRole: true,
    }
  ];
};

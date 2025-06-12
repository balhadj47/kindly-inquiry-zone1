
import { supabase } from '@/integrations/supabase/client';
import type { User, Group, Permission, UserRole, UserStatus } from '@/types/rbac';
import { DEFAULT_PERMISSIONS } from '@/types/rbac';

export const loadInitialData = async (authUser: any) => {
  console.log('Loading initial RBAC data from database for user:', authUser?.id);
  
  try {
    // Load users from database
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.error('Error loading users from database:', usersError);
      throw usersError;
    }

    // Load user groups from database
    const { data: groupsData, error: groupsError } = await supabase
      .from('user_groups')
      .select('*');

    if (groupsError) {
      console.error('Error loading groups from database:', groupsError);
      throw groupsError;
    }

    // Helper function to determine groupId based on role_id
    const getGroupIdForRoleId = (roleId: number | null): string => {
      switch (roleId) {
        case 1:
          return 'administrator';
        case 2:
          return 'supervisor';
        case 3:
          return 'driver';
        case 4:
          return 'security';
        case 5:
          return 'employee';
        default:
          return 'employee';
      }
    };

    // Transform database users to RBAC User format
    const users: User[] = (usersData || []).map(user => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
      status: user.status as UserStatus,
      groupId: getGroupIdForRoleId(user.role_id),
      createdAt: user.created_at,
      totalTrips: user.total_trips || 0,
      lastTrip: user.last_trip,
      profileImage: user.profile_image,
    }));

    // Transform database groups to RBAC Group format
    let groups: Group[] = (groupsData || []).map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      permissions: group.permissions || [],
      color: group.color,
    }));

    // Ensure we have default groups with proper permissions format that matches menu expectations
    const requiredGroups = [
      { 
        id: 'administrator', 
        name: 'Administrateurs', 
        description: 'Accès complet au système', 
        permissions: [
          'dashboard:read',
          'companies:read', 
          'companies:create',
          'companies:update',
          'companies:delete',
          'vans:read',
          'vans:create', 
          'vans:update',
          'vans:delete',
          'users:read',
          'users:create',
          'users:update', 
          'users:delete',
          'trips:read',
          'trips:create',
          'trips:update',
          'trips:delete'
        ], 
        color: '#ef4444' 
      },
      { 
        id: 'supervisor', 
        name: 'Superviseurs', 
        description: 'Chefs de groupe', 
        permissions: ['dashboard:read', 'trips:read', 'trips:create', 'trips:update', 'vans:read', 'users:read'], 
        color: '#f59e0b' 
      },
      { 
        id: 'driver', 
        name: 'Chauffeurs', 
        description: 'Chauffeurs', 
        permissions: ['dashboard:read', 'trips:read', 'trips:create', 'vans:read'], 
        color: '#10b981' 
      },
      { 
        id: 'security', 
        name: 'Sécurité', 
        description: 'Agents de sécurité', 
        permissions: ['dashboard:read', 'trips:read', 'trips:create'], 
        color: '#8b5cf6' 
      },
      { 
        id: 'employee', 
        name: 'Employés', 
        description: 'Accès de base', 
        permissions: ['dashboard:read', 'trips:read', 'trips:create'], 
        color: '#3b82f6' 
      },
    ];

    for (const requiredGroup of requiredGroups) {
      const existingGroup = groups.find(group => group.id === requiredGroup.id);
      if (!existingGroup) {
        console.log(`Creating default group: ${requiredGroup.name}`);
        groups.push(requiredGroup);
      } else {
        // Update existing group with correct permissions format
        console.log(`Updating permissions for existing group: ${requiredGroup.name}`);
        existingGroup.permissions = requiredGroup.permissions;
      }
    }

    // Use default permissions
    const permissions = DEFAULT_PERMISSIONS;
    
    // Find current user from database users
    let currentUser: User | null = null;
    if (authUser?.id) {
      // Try to find user by auth_user_id
      const dbUser = usersData?.find(user => user.auth_user_id === authUser.id);
      if (dbUser) {
        currentUser = {
          id: dbUser.id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          phone: dbUser.phone,
          role: dbUser.role as UserRole,
          status: dbUser.status as UserStatus,
          groupId: getGroupIdForRoleId(dbUser.role_id),
          createdAt: dbUser.created_at,
          totalTrips: dbUser.total_trips || 0,
          lastTrip: dbUser.last_trip,
          profileImage: dbUser.profile_image,
        };
      }
    }

    // If no current user found from auth, use first admin or first user
    if (!currentUser && users.length > 0) {
      currentUser = users.find(user => user.role === 'Administrator') || users[0];
    }
    
    console.log('Database data loaded successfully:', {
      usersCount: users.length,
      groupsCount: groups.length,
      permissionsCount: permissions.length,
      currentUser: currentUser?.id,
      currentUserRole: currentUser?.role,
      currentUserGroupId: currentUser?.groupId,
      authUserId: authUser?.id,
      adminGroupPermissions: groups.find(g => g.id === 'administrator')?.permissions
    });
    
    return {
      users,
      groups,
      permissions,
      currentUser,
    };
  } catch (error) {
    console.error('Error loading RBAC data from database:', error);
    return {
      users: [],
      groups: [],
      permissions: DEFAULT_PERMISSIONS,
      currentUser: null,
    };
  }
};

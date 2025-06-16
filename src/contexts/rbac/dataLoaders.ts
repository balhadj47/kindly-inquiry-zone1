
import { supabase } from '@/integrations/supabase/client';
import type { User, Role, Permission, UserRole, UserStatus } from '@/types/rbac';
import { DEFAULT_PERMISSIONS, DEFAULT_ROLES } from '@/types/rbac';

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

    // Load roles from database
    const { data: rolesData, error: rolesError } = await supabase
      .from('roles')
      .select('*');

    if (rolesError) {
      console.error('Error loading roles from database:', rolesError);
      throw rolesError;
    }

    // Transform database users to RBAC User format
    const users: User[] = (usersData || []).map(user => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
      status: user.status as UserStatus,
      createdAt: user.created_at,
      totalTrips: user.total_trips || 0,
      lastTrip: user.last_trip,
      profileImage: user.profile_image,
    }));

    // Transform database roles to RBAC Role format, merge with defaults
    let roles: Role[] = DEFAULT_ROLES.slice(); // Start with default roles

    // Add any custom roles from database
    if (rolesData && rolesData.length > 0) {
      const customRoles: Role[] = rolesData
        .filter(role => !DEFAULT_ROLES.some(defaultRole => defaultRole.id === role.id))
        .map(role => ({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: Array.isArray(role.permissions) ? role.permissions : [],
          color: role.color,
          isSystemRole: false,
        }));
      
      roles = [...roles, ...customRoles];
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
          createdAt: dbUser.created_at,
          totalTrips: dbUser.total_trips || 0,
          lastTrip: dbUser.last_trip,
          profileImage: dbUser.profile_image,
        };
      }
    }

    // Only use admin fallback if no current user found and there are users in the database
    if (!currentUser && users.length > 0) {
      currentUser = users.find(user => user.role === 'Administrator') || null;
    }
    
    console.log('Database data loaded successfully:', {
      usersCount: users.length,
      rolesCount: roles.length,
      permissionsCount: permissions.length,
      currentUser: currentUser?.id,
      currentUserRole: currentUser?.role,
      authUserId: authUser?.id,
      administratorRole: roles.find(r => r.id === 'administrator'),
    });
    
    return {
      users,
      roles,
      permissions,
      currentUser,
    };
  } catch (error) {
    console.error('Error loading RBAC data from database:', error);
    return {
      users: [],
      roles: DEFAULT_ROLES,
      permissions: DEFAULT_PERMISSIONS,
      currentUser: null,
    };
  }
};

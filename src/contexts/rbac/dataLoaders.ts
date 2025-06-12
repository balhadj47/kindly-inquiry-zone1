
import { supabase } from '@/integrations/supabase/client';
import type { User, Group, Permission } from '@/types/rbac';
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

    // Transform database users to RBAC User format
    const users: User[] = (usersData || []).map(user => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      groupId: 'employee', // Default groupId since we don't have group mapping yet
      createdAt: user.created_at,
      totalTrips: user.total_trips || 0,
      lastTrip: user.last_trip,
      profileImage: user.profile_image,
    }));

    // Transform database groups to RBAC Group format
    const groups: Group[] = (groupsData || []).map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      permissions: group.permissions || [],
      color: group.color,
    }));

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
          role: dbUser.role,
          status: dbUser.status,
          groupId: 'employee', // Default groupId
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
      authUserId: authUser?.id
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

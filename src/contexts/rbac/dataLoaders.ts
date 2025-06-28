
import { supabase } from '@/integrations/supabase/client';
import type { User, UserStatus } from '@/types/rbac';
import type { SystemGroup, SystemGroupName } from '@/types/systemGroups';

export const loadRoles = async (): Promise<SystemGroup[]> => {
  console.log('🔄 loadRoles: Starting to load roles from database...');
  const startTime = performance.now();

  try {
    // Direct query without auth checks for role loading
    console.log('📋 loadRoles: Making database query to user_groups table...');
    
    const { data: groupsData, error: groupsError } = await supabase
      .from('user_groups')
      .select('*')
      .order('role_id');

    console.log('📋 loadRoles: Raw database response:', { 
      data: groupsData?.length || 0, 
      error: groupsError?.code || null
    });

    if (groupsError) {
      console.error('❌ loadRoles: Database error:', groupsError);
      // Don't throw error, return empty array to prevent crashes
      return [];
    }

    if (!groupsData || groupsData.length === 0) {
      console.log('📝 loadRoles: No groups found in database');
      return [];
    }

    // Transform the groups data to match SystemGroup interface
    const rolesWithPermissions = groupsData
      .filter(group => group.role_id !== null && group.name)
      .map((group) => {
        console.log(`📋 Processing role: ${group.name} (role_id: ${group.role_id})`);
        
        const permissions = Array.isArray(group.permissions) ? group.permissions : [];
        const accessiblePages = getAccessiblePages(permissions);

        return {
          id: group.id.toString(),
          name: group.name as SystemGroupName,
          description: group.description || `Role ${group.role_id}`,
          permissions: permissions,
          color: group.color || '#3b82f6',
          role_id: group.role_id,
          isSystemRole: false,
          accessiblePages: accessiblePages,
        };
      });

    const endTime = performance.now();
    console.log(`✅ loadRoles: Successfully loaded ${rolesWithPermissions.length} roles in ${endTime - startTime}ms`);

    return rolesWithPermissions as SystemGroup[];
  } catch (error) {
    console.error('❌ loadRoles: Critical error:', error);
    return []; // Return empty array instead of throwing
  }
};

// Helper function to determine accessible pages based on permissions
const getAccessiblePages = (permissions: string[]): string[] => {
  const accessiblePages: string[] = [];
  
  const pagePermissions = {
    '/dashboard': ['dashboard:read'],
    '/companies': ['companies:read'],
    '/vans': ['vans:read'],
    '/employees': ['users:read'],
    '/auth-users': ['auth-users:read', 'users:read'],
    '/missions': ['trips:read'],
    '/log-trip': ['trips:create'],
    '/trip-history': ['trips:read'],
    '/settings': [],
    '/user-settings': [],
  };

  Object.entries(pagePermissions).forEach(([page, requiredPermissions]) => {
    if (requiredPermissions.length === 0) {
      accessiblePages.push(page);
      return;
    }

    const hasAccess = requiredPermissions.some(permission => 
      permissions.includes(permission) || permissions.includes('*')
    );

    if (hasAccess) {
      accessiblePages.push(page);
    }
  });

  return accessiblePages;
};

export const loadUsers = async (): Promise<User[]> => {
  console.log('🔄 loadUsers: Loading users from database...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ loadUsers: Error loading users:', error);
      return []; // Return empty array instead of throwing
    }

    console.log(`✅ loadUsers: Loaded ${data?.length || 0} users`);

    return (data || []).map(user => ({
      id: user.id.toString(),
      name: user.name || '',
      email: user.email || undefined,
      phone: user.phone || '',
      role_id: user.role_id || 1,
      status: (user.status || 'Active') as UserStatus,
      createdAt: user.created_at,
      licenseNumber: user.driver_license,
      totalTrips: user.total_trips,
      lastTrip: user.last_trip,
      profileImage: user.profile_image,
      badgeNumber: user.badge_number,
      dateOfBirth: user.date_of_birth,
      placeOfBirth: user.place_of_birth,
      address: user.address,
      driverLicense: user.driver_license,
    }));
  } catch (error) {
    console.error('❌ loadUsers: Failed to load users:', error);
    return [];
  }
};

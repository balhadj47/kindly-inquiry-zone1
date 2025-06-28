import { supabase } from '@/integrations/supabase/client';
import type { User, UserStatus } from '@/types/rbac';
import type { SystemGroup, SystemGroupName } from '@/types/systemGroups';

export const loadRoles = async (): Promise<SystemGroup[]> => {
  console.log('🔄 Loading system groups/roles from database...');
  const startTime = performance.now();

  try {
    // First, check authentication status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('🔐 Auth status:', { user: user?.email, authError });

    // Load user_groups with their permissions directly from the table
    console.log('📋 Making database query to user_groups table...');
    const { data: groupsData, error: groupsError } = await supabase
      .from('user_groups')
      .select('*')
      .order('role_id');

    console.log('📋 Database query result:', { 
      data: groupsData, 
      error: groupsError,
      dataLength: groupsData?.length 
    });

    if (groupsError) {
      console.error('❌ Error loading user groups:', groupsError);
      throw groupsError;
    }

    if (!groupsData || groupsData.length === 0) {
      console.log('📝 No groups found in database');
      return [];
    }

    console.log('📋 Raw groups data from database:', groupsData);

    // Transform the groups data to match SystemGroup interface
    const rolesWithPermissions = (groupsData || []).map((group) => {
      console.log(`📋 Processing database role: ${group.name} (role_id: ${group.role_id})`);
      console.log(`📋 Raw permissions from database:`, group.permissions);
      
      // Use permissions directly from the user_groups table
      const permissions = Array.isArray(group.permissions) ? group.permissions : [];
      console.log(`📋 Processed ${permissions.length} permissions for ${group.name}:`, permissions);

      return {
        id: group.id.toString(),
        name: group.name as SystemGroupName,
        description: group.description || '',
        permissions: permissions,
        color: group.color || '#3b82f6',
        role_id: group.role_id,
        isSystemRole: false, // Mark as custom since loaded from database
      };
    });

    const endTime = performance.now();
    console.log(`✅ Loaded ${rolesWithPermissions.length} roles from database in ${endTime - startTime}ms`);
    console.log('📋 Final processed roles from database:', rolesWithPermissions);

    return rolesWithPermissions;
  } catch (error) {
    console.error('❌ Failed to load roles from database:', error);
    
    // Return empty array instead of fallback roles to avoid confusion
    console.log('📋 Returning empty roles array due to database error');
    return [];
  }
};

// Keep this function for backwards compatibility, but it won't be used for auth
export const loadUsers = async (): Promise<User[]> => {
  console.log('🔄 Loading users from database (for employee management only)...');
  const startTime = performance.now();

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading users:', error);
      throw error;
    }

    const endTime = performance.now();
    console.log(`✅ Loaded ${data?.length || 0} users in ${endTime - startTime}ms`);

    return (data || []).map(user => ({
      id: user.id.toString(),
      name: user.name || '',
      email: user.email || undefined,
      phone: user.phone || '',
      role_id: user.role_id || 3,
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
    console.error('❌ Failed to load users:', error);
    return [];
  }
};

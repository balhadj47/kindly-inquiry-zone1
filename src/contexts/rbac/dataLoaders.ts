import { supabase } from '@/integrations/supabase/client';
import type { User, UserStatus } from '@/types/rbac';
import type { SystemGroup, SystemGroupName } from '@/types/systemGroups';

export const loadRoles = async (): Promise<SystemGroup[]> => {
  console.log('🔄 loadRoles: Starting to load roles from database...');
  const startTime = performance.now();

  try {
    // First, check authentication status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('🔐 loadRoles: Auth status:', { user: user?.email, authError });

    // Load user_groups with their permissions directly from the table
    console.log('📋 loadRoles: Making database query to user_groups table...');
    console.log('📋 loadRoles: Query details - SELECT * FROM user_groups ORDER BY role_id');
    
    const { data: groupsData, error: groupsError } = await supabase
      .from('user_groups')
      .select('*')
      .order('role_id');

    console.log('📋 loadRoles: Raw database response:', { 
      data: groupsData, 
      error: groupsError,
      dataLength: groupsData?.length,
      errorCode: groupsError?.code,
      errorMessage: groupsError?.message,
      errorDetails: groupsError?.details
    });

    if (groupsError) {
      console.error('❌ loadRoles: Database error details:', {
        code: groupsError.code,
        message: groupsError.message,
        details: groupsError.details,
        hint: groupsError.hint
      });
      throw groupsError;
    }

    if (!groupsData || groupsData.length === 0) {
      console.log('📝 loadRoles: No groups found in database - this might be the issue!');
      console.log('📝 loadRoles: Checking if table exists and has data...');
      
      // Try a simple count query to see if the table has any data
      const { count, error: countError } = await supabase
        .from('user_groups')
        .select('*', { count: 'exact', head: true });
        
      console.log('📝 loadRoles: Table count check:', { count, countError });
      
      return [];
    }

    console.log('📋 loadRoles: Processing database roles:', {
      totalRoles: groupsData.length,
      roleNames: groupsData.map(g => g.name),
      roleIds: groupsData.map(g => g.role_id),
      sampleRole: groupsData[0]
    });

    // Transform the groups data to match SystemGroup interface
    const rolesWithPermissions = groupsData.map((group, index) => {
      console.log(`📋 loadRoles: Processing role ${index + 1}/${groupsData.length}:`, {
        name: group.name,
        role_id: group.role_id,
        id: group.id,
        description: group.description,
        color: group.color,
        permissions: group.permissions,
        permissionsType: typeof group.permissions,
        permissionsLength: Array.isArray(group.permissions) ? group.permissions.length : 'not array'
      });
      
      // Validate required fields
      if (!group.role_id && group.role_id !== 0) {
        console.warn(`⚠️ loadRoles: Group ${group.name || 'unnamed'} has no role_id:`, group);
        return null;
      }
      
      if (!group.name) {
        console.warn(`⚠️ loadRoles: Group with role_id ${group.role_id} has no name:`, group);
        return null;
      }
      
      // Use permissions directly from the user_groups table
      const permissions = Array.isArray(group.permissions) ? group.permissions : [];
      console.log(`📋 loadRoles: Final permissions for ${group.name}:`, permissions);

      const transformedRole = {
        id: group.id.toString(),
        name: group.name as SystemGroupName,
        description: group.description || `Role ${group.role_id}`,
        permissions: permissions,
        color: group.color || '#3b82f6',
        role_id: group.role_id,
        isSystemRole: false, // Mark as custom since loaded from database
      };
      
      console.log(`✅ loadRoles: Transformed role ${group.name}:`, transformedRole);
      return transformedRole;
    }).filter(Boolean); // Remove null entries

    const endTime = performance.now();
    console.log(`✅ loadRoles: Successfully loaded ${rolesWithPermissions.length} roles from database in ${endTime - startTime}ms`);
    console.log('📋 loadRoles: Final roles array:', rolesWithPermissions);

    return rolesWithPermissions as SystemGroup[];
  } catch (error) {
    console.error('❌ loadRoles: Critical error loading roles from database:', {
      error: error?.message || error,
      stack: error?.stack,
      name: error?.name,
      timestamp: new Date().toISOString()
    });
    
    // Return empty array instead of fallback roles to avoid confusion
    console.log('📋 loadRoles: Returning empty roles array due to error');
    return [];
  }
};

// Keep this function for backwards compatibility, but it won't be used for auth
export const loadUsers = async (): Promise<User[]> => {
  console.log('🔄 loadUsers: Loading users from database (for employee management only)...');
  const startTime = performance.now();

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ loadUsers: Error loading users:', error);
      throw error;
    }

    const endTime = performance.now();
    console.log(`✅ loadUsers: Loaded ${data?.length || 0} users in ${endTime - startTime}ms`);

    return (data || []).map(user => ({
      id: user.id.toString(),
      name: user.name || '',
      email: user.email || undefined,
      phone: user.phone || '',
      role_id: user.role_id || 1, // Default to 1 if no role_id
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

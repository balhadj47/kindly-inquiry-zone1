
import { supabase } from '@/integrations/supabase/client';
import type { User, UserStatus } from '@/types/rbac';
import type { SystemGroup, SystemGroupName } from '@/types/systemGroups';

export const loadRoles = async (): Promise<SystemGroup[]> => {
  console.log('🔄 Loading system groups/roles from database...');
  const startTime = performance.now();

  try {
    // Load user_groups with their permissions from role_permissions table
    const { data: groupsData, error: groupsError } = await supabase
      .from('user_groups')
      .select('*')
      .order('role_id');

    if (groupsError) {
      console.error('❌ Error loading user groups:', groupsError);
      throw groupsError;
    }

    console.log('📋 Raw groups data:', groupsData);

    // For each group, get its permissions from role_permissions table directly
    const rolesWithPermissions = await Promise.all(
      (groupsData || []).map(async (group) => {
        console.log(`📋 Loading permissions for role_id: ${group.role_id}`);
        
        // Query role_permissions table directly instead of using RPC
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('role_permissions')
          .select('permission_name')
          .eq('role_id', group.role_id);

        if (permissionsError) {
          console.error(`❌ Error loading permissions for role ${group.role_id}:`, permissionsError);
          // Fall back to stored permissions in user_groups table if query fails
          return {
            id: group.id.toString(),
            name: group.name as SystemGroupName,
            description: group.description,
            permissions: group.permissions || [],
            color: group.color,
            role_id: group.role_id,
            isSystemRole: true,
          };
        }

        // Extract permission names from the array
        const permissions = (permissionsData || []).map((p: any) => p.permission_name);
        console.log(`📋 Loaded ${permissions.length} permissions for ${group.name}:`, permissions);

        return {
          id: group.id.toString(),
          name: group.name as SystemGroupName,
          description: group.description,
          permissions: permissions,
          color: group.color,
          role_id: group.role_id,
          isSystemRole: true,
        };
      })
    );

    const endTime = performance.now();
    console.log(`✅ Loaded ${rolesWithPermissions.length} roles with database permissions in ${endTime - startTime}ms`);
    console.log('📋 Final roles data:', rolesWithPermissions);

    return rolesWithPermissions;
  } catch (error) {
    console.error('❌ Failed to load roles from database:', error);
    
    // Return minimal default roles as fallback
    const fallbackRoles = [
      {
        id: '1',
        name: 'Administrator' as SystemGroupName,
        description: 'Full system access',
        permissions: ['dashboard:read'], // Minimal permission
        color: '#dc2626',
        role_id: 1,
        isSystemRole: true,
      },
      {
        id: '2', 
        name: 'Supervisor' as SystemGroupName,
        description: 'Limited access',
        permissions: ['dashboard:read'],
        color: '#ea580c',
        role_id: 2,
        isSystemRole: true,
      },
      {
        id: '3',
        name: 'Employee' as SystemGroupName, 
        description: 'Basic access',
        permissions: ['dashboard:read'],
        color: '#3b82f6',
        role_id: 3,
        isSystemRole: true,
      }
    ];
    
    console.log('📋 Using fallback roles:', fallbackRoles);
    return fallbackRoles;
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

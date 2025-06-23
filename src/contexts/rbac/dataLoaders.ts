import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/rbac';
import type { SystemGroup } from '@/types/systemGroups';

export const loadRoles = async (): Promise<SystemGroup[]> => {
  console.log('🔄 Loading system groups/roles...');
  const startTime = performance.now();

  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('*')
      .order('role_id');

    if (error) {
      console.error('❌ Error loading roles:', error);
      throw error;
    }

    const endTime = performance.now();
    console.log(`✅ Loaded ${data?.length || 0} roles in ${endTime - startTime}ms`);

    return (data || []).map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      permissions: group.permissions || [],
      color: group.color,
      role_id: group.role_id,
    }));
  } catch (error) {
    console.error('❌ Failed to load roles:', error);
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
      status: user.status || 'Active',
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

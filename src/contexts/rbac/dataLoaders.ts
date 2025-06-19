
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/rbac';
import { SystemGroup, SystemGroupName } from '@/types/systemGroups';

// Define the expected database user structure
interface DbUser {
  id: number;
  auth_user_id: string | null;
  name: string;
  email: string | null;
  phone: string;
  role_id: number;
  status: string;
  created_at: string;
  driver_license: string | null;
  total_trips: number;
  last_trip: string | null;
  profile_image: string | null;
  badge_number: string | null;
  date_of_birth: string | null;
  place_of_birth: string | null;
  address: string | null;
}

export const loadUsers = async (): Promise<User[]> => {
  console.log('📊 Loading users from database...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading users:', error);
      throw error;
    }

    console.log('✅ Raw users data loaded:', data?.length || 0, data);

    if (!data || data.length === 0) {
      console.warn('⚠️ No users found in database');
      return [];
    }

    const transformedUsers = data.map((user: DbUser) => {
      console.log('🔄 Transforming user:', user.id, user);
      
      return {
        id: user.id.toString(),
        name: user.name || '',
        email: user.email || undefined,
        phone: user.phone || '',
        role_id: user.role_id || 3, // Default to Employee role_id
        status: user.status as User['status'] || 'Active',
        createdAt: user.created_at,
        licenseNumber: user.driver_license || undefined,
        totalTrips: user.total_trips || 0,
        lastTrip: user.last_trip || undefined,
        profileImage: user.profile_image || undefined,
        badgeNumber: user.badge_number || undefined,
        dateOfBirth: user.date_of_birth || undefined,
        placeOfBirth: user.place_of_birth || undefined,
        address: user.address || undefined,
        driverLicense: user.driver_license || undefined,
      };
    });

    console.log('✅ Transformed users:', transformedUsers.length, transformedUsers);
    return transformedUsers;

  } catch (error) {
    console.error('❌ CRITICAL ERROR loading users:', error);
    return [];
  }
};

export const loadRoles = async (): Promise<SystemGroup[]> => {
  console.log('📊 Loading system groups from database...');
  
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('*')
      .order('name');

    if (error) {
      console.error('❌ Error loading system groups:', error);
      throw error;
    }

    console.log('✅ Raw system groups data loaded:', data?.length || 0, data);

    if (!data || data.length === 0) {
      console.warn('⚠️ No system groups found in database');
      return [];
    }

    return data.map(group => ({
      id: group.id,
      name: group.name as SystemGroupName,
      description: group.description || '',
      permissions: group.permissions || [],
      color: group.color || '#3b82f6',
      isSystemRole: true,
    }));

  } catch (error) {
    console.error('❌ CRITICAL ERROR loading roles:', error);  
    return [];
  }
};

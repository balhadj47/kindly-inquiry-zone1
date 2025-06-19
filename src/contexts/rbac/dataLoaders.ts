import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/rbac';
import { SystemGroup, SystemGroupName } from '@/types/systemGroups';

export const loadUsers = async (): Promise<User[]> => {
  console.log('📊 Loading users from database...');
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error loading users:', error);
    throw error;
  }

  console.log('✅ Raw users data loaded:', data?.length || 0);

  return (data || []).map(user => ({
    id: user.id.toString(),
    name: user.name || '',
    email: user.email || undefined,
    phone: user.phone || '',
    role_id: user.role_id || 3, // Default to Employee role_id
    status: user.status as User['status'] || 'Active',
    createdAt: user.created_at,
    licenseNumber: (user as any).driver_license || undefined,
    totalTrips: user.total_trips || 0,
    lastTrip: user.last_trip || undefined,
    profileImage: user.profile_image || undefined,
    badgeNumber: (user as any).badge_number || undefined,
    dateOfBirth: (user as any).date_of_birth || undefined,
    placeOfBirth: (user as any).place_of_birth || undefined,
    address: (user as any).address || undefined,
    driverLicense: (user as any).driver_license || undefined,
  }));
};

export const loadRoles = async (): Promise<SystemGroup[]> => {
  console.log('📊 Loading system groups from database...');
  
  const { data, error } = await supabase
    .from('user_groups')
    .select('*')
    .order('name');

  if (error) {
    console.error('❌ Error loading system groups:', error);
    throw error;
  }

  console.log('✅ Raw system groups data loaded:', data?.length || 0);

  return (data || []).map(group => ({
    id: group.id,
    name: group.name as SystemGroupName,
    description: group.description || '',
    permissions: group.permissions || [],
    color: group.color || '#3b82f6',
    isSystemRole: true,
  }));
};

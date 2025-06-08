
import { supabase } from '@/integrations/supabase/client';
import type { User, UserRole, UserStatus } from '@/types/rbac';

export const loadUsersFromDB = async (): Promise<User[]> => {
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('*');

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return [];
  }

  console.log('Raw user data from DB:', usersData || []);

  const formattedUsers: User[] = (usersData || []).map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    groupId: user.group_id,
    role: user.role as UserRole,
    status: user.status as UserStatus,
    createdAt: user.created_at,
    licenseNumber: user.license_number,
    totalTrips: user.total_trips,
    lastTrip: user.last_trip,
  }));

  console.log('Formatted users from DB:', formattedUsers);
  return formattedUsers;
};

export const loadGroupsFromDB = async () => {
  const { data: groupsData, error: groupsError } = await supabase
    .from('user_groups')
    .select('*');

  if (groupsError) {
    console.error('Error fetching groups:', groupsError);
    return null;
  }

  if (!groupsData || groupsData.length === 0) {
    return null;
  }

  console.log('Raw group data from DB:', groupsData);

  const formattedGroups = groupsData.map(group => ({
    id: group.id,
    name: group.name,
    description: group.description,
    permissions: Array.isArray(group.permissions) ? group.permissions : [],
    color: group.color || 'bg-gray-100 text-gray-800',
  }));

  console.log('Formatted groups from DB (overriding defaults):', formattedGroups);
  return formattedGroups;
};

export const loadDefaultData = async () => {
  const { DEFAULT_GROUPS, DEFAULT_PERMISSIONS } = await import('@/types/rbac');
  console.log('Default groups and permissions loaded:', DEFAULT_GROUPS);
  return { DEFAULT_GROUPS, DEFAULT_PERMISSIONS };
};

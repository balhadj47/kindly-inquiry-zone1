
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

export const loadCurrentUserFromAuth = async (): Promise<User | null> => {
  try {
    console.log('Starting loadCurrentUserFromAuth...');
    
    // First check if we have an authenticated user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return null;
    }
    
    if (!session?.user) {
      console.log('No authenticated session found');
      return null;
    }

    console.log('Authenticated user found:', session.user.email);
    console.log('Auth user ID:', session.user.id);

    // Try to get the current user's RBAC data using the RPC function
    const { data: currentUserData, error } = await supabase
      .rpc('get_current_user_rbac');

    console.log('RPC result:', { currentUserData, error });

    if (error) {
      console.error('Error fetching current user RBAC data:', error);
    }

    if (!currentUserData) {
      console.log('No RBAC user record found for authenticated user, trying email lookup...');
      
      // Try to find user by email as fallback
      const { data: userByEmail, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .maybeSingle();

      console.log('Email lookup result:', { userByEmail, emailError });

      if (emailError) {
        console.error('Error searching for user by email:', emailError);
        return null;
      }

      if (userByEmail) {
        console.log('Found user by email lookup:', userByEmail);
        const currentUser: User = {
          id: userByEmail.id,
          name: userByEmail.name,
          email: userByEmail.email,
          phone: userByEmail.phone,
          groupId: userByEmail.group_id,
          role: userByEmail.role as UserRole,
          status: userByEmail.status as UserStatus,
          createdAt: userByEmail.created_at,
          licenseNumber: userByEmail.license_number,
          totalTrips: userByEmail.total_trips,
          lastTrip: userByEmail.last_trip,
        };
        console.log('Returning formatted user from email lookup:', currentUser);
        return currentUser;
      }

      // If no user record exists, create a default admin user for testing
      console.log('No user record found, creating default admin user...');
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          auth_user_id: session.user.id,
          name: session.user.email?.split('@')[0] || 'Admin User',
          email: session.user.email,
          phone: '',
          group_id: 'admin',
          role: 'Administrator',
          status: 'Active',
        }])
        .select()
        .single();

      console.log('User creation result:', { newUser, createError });

      if (createError) {
        console.error('Error creating user record:', createError);
        return null;
      }

      if (newUser) {
        console.log('Created new admin user:', newUser);
        const currentUser: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          groupId: newUser.group_id,
          role: newUser.role as UserRole,
          status: newUser.status as UserStatus,
          createdAt: newUser.created_at,
          licenseNumber: newUser.license_number,
          totalTrips: newUser.total_trips,
          lastTrip: newUser.last_trip,
        };
        console.log('Returning newly created user:', currentUser);
        return currentUser;
      }

      return null;
    }

    // Format the user data to match our User interface
    const currentUser: User = {
      id: currentUserData.id,
      name: currentUserData.name,
      email: currentUserData.email,
      phone: currentUserData.phone,
      groupId: currentUserData.group_id,
      role: currentUserData.role as UserRole,
      status: currentUserData.status as UserStatus,
      createdAt: currentUserData.created_at,
      licenseNumber: currentUserData.license_number,
      totalTrips: currentUserData.total_trips,
      lastTrip: currentUserData.last_trip,
    };

    console.log('Current authenticated user loaded from RPC:', currentUser);
    return currentUser;
  } catch (error) {
    console.error('Error loading current user from auth:', error);
    return null;
  }
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

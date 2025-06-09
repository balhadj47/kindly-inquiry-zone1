
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
    console.log('=== Starting loadCurrentUserFromAuth ===');
    
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

    const authUser = session.user;
    console.log('Authenticated user found:', authUser.email);
    console.log('Auth user ID:', authUser.id);

    // Try multiple approaches to find the user
    console.log('=== Attempting to find user record ===');
    
    // Method 1: Try RPC function first
    console.log('Method 1: Trying RPC function...');
    const { data: rpcUserData, error: rpcError } = await supabase
      .rpc('get_current_user_rbac');

    console.log('RPC result:', { rpcUserData, rpcError });

    if (rpcUserData && !rpcError) {
      const currentUser: User = {
        id: rpcUserData.id,
        name: rpcUserData.name,
        email: rpcUserData.email,
        phone: rpcUserData.phone,
        groupId: rpcUserData.group_id,
        role: rpcUserData.role as UserRole,
        status: rpcUserData.status as UserStatus,
        createdAt: rpcUserData.created_at,
        licenseNumber: rpcUserData.license_number,
        totalTrips: rpcUserData.total_trips,
        lastTrip: rpcUserData.last_trip,
      };
      console.log('SUCCESS: User found via RPC:', currentUser);
      return currentUser;
    }

    // Method 2: Search by auth_user_id
    console.log('Method 2: Searching by auth_user_id...');
    const { data: userByAuthId, error: authIdError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .maybeSingle();

    console.log('Auth ID search result:', { userByAuthId, authIdError });

    if (userByAuthId && !authIdError) {
      const currentUser: User = {
        id: userByAuthId.id,
        name: userByAuthId.name,
        email: userByAuthId.email,
        phone: userByAuthId.phone,
        groupId: userByAuthId.group_id,
        role: userByAuthId.role as UserRole,
        status: userByAuthId.status as UserStatus,
        createdAt: userByAuthId.created_at,
        licenseNumber: userByAuthId.license_number,
        totalTrips: userByAuthId.total_trips,
        lastTrip: userByAuthId.last_trip,
      };
      console.log('SUCCESS: User found by auth_user_id:', currentUser);
      return currentUser;
    }

    // Method 3: Search by email
    console.log('Method 3: Searching by email...');
    const { data: userByEmail, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle();

    console.log('Email search result:', { userByEmail, emailError });

    if (userByEmail && !emailError) {
      // Update the auth_user_id if it's missing
      if (!userByEmail.auth_user_id) {
        console.log('Updating auth_user_id for existing user...');
        const { error: updateError } = await supabase
          .from('users')
          .update({ auth_user_id: authUser.id })
          .eq('id', userByEmail.id);
        
        if (updateError) {
          console.error('Error updating auth_user_id:', updateError);
        } else {
          console.log('Successfully updated auth_user_id');
        }
      }

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
      console.log('SUCCESS: User found by email:', currentUser);
      return currentUser;
    }

    // Method 4: Check if user exists but with different email format
    console.log('Method 4: Checking all users to debug...');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('*');

    console.log('All users in database:', allUsers);
    console.log('Looking for email:', authUser.email);

    if (allUsers && allUsers.length > 0) {
      // Try to find a user with similar email or that might be the admin
      const potentialUser = allUsers.find(user => 
        user.email?.toLowerCase() === authUser.email?.toLowerCase() ||
        user.group_id === 'admin'
      );
      
      if (potentialUser) {
        console.log('Found potential user match:', potentialUser);
        
        // Update this user to link with current auth user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ 
            auth_user_id: authUser.id,
            email: authUser.email 
          })
          .eq('id', potentialUser.id)
          .select()
          .single();

        if (!updateError && updatedUser) {
          const currentUser: User = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            groupId: updatedUser.group_id,
            role: updatedUser.role as UserRole,
            status: updatedUser.status as UserStatus,
            createdAt: updatedUser.created_at,
            licenseNumber: updatedUser.license_number,
            totalTrips: updatedUser.total_trips,
            lastTrip: updatedUser.last_trip,
          };
          console.log('SUCCESS: Updated and linked existing user:', currentUser);
          return currentUser;
        }
      }
    }

    // Method 5: Create new admin user as last resort
    console.log('Method 5: Creating new admin user...');
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{
        auth_user_id: authUser.id,
        name: authUser.email?.split('@')[0] || 'Admin User',
        email: authUser.email,
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
      console.log('SUCCESS: Created new admin user:', currentUser);
      return currentUser;
    }

    console.log('FAILED: All methods exhausted, no user found or created');
    return null;

  } catch (error) {
    console.error('CRITICAL ERROR in loadCurrentUserFromAuth:', error);
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

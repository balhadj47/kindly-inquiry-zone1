
import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';
import { UserOperationData } from './types';

export const createAddUserOperation = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const addUser = async (userData: UserOperationData): Promise<User> => {
    console.log('Adding user to database:', userData);
    
    try {
      // First check if current user has permission to create users
      const { data: hasPermission, error: permError } = await supabase.rpc('current_user_can_create_users');
      
      if (permError) {
        console.error('Error checking user creation permission:', permError);
        throw new Error('Failed to verify permissions');
      }
      
      if (!hasPermission) {
        console.error('User does not have permission to create users');
        throw new Error('You do not have permission to create users');
      }
      
      console.log('User has permission to create users, proceeding...');
      
      // Get default role_id dynamically from available roles based on permission count
      let defaultRoleId = userData.role_id;
      if (!defaultRoleId) {
        // Fetch available roles to determine default (role with least permissions)
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_groups')
          .select('role_id, name, permissions')
          .order('role_id', { ascending: true });
        
        if (!rolesError && rolesData && rolesData.length > 0) {
          // Sort by permission count (ascending) and use the role with least permissions
          const sortedRoles = rolesData
            .filter(role => role.permissions && Array.isArray(role.permissions))
            .sort((a, b) => a.permissions.length - b.permissions.length);
          
          if (sortedRoles.length > 0) {
            defaultRoleId = sortedRoles[0].role_id;
            console.log('Using role with least permissions as default:', sortedRoles[0].name, 'role_id:', defaultRoleId);
          } else {
            // Fallback to first available role
            defaultRoleId = rolesData[0].role_id;
            console.log('Using first available role as default:', rolesData[0].name, 'role_id:', defaultRoleId);
          }
        } else {
          console.warn('Could not fetch roles for default, using null role_id');
          defaultRoleId = null;
        }
      }
      
      const insertData: any = {
        name: userData.name,
        phone: userData.phone || null,
        role_id: defaultRoleId,
        status: userData.status || 'Active',
        profile_image: userData.profileImage || null,
        total_trips: userData.totalTrips || 0,
        last_trip: userData.lastTrip || null,
        badge_number: userData.badgeNumber || null,
        date_of_birth: userData.dateOfBirth && userData.dateOfBirth.trim() !== '' ? userData.dateOfBirth : null,
        place_of_birth: userData.placeOfBirth && userData.placeOfBirth.trim() !== '' ? userData.placeOfBirth : null,
        address: userData.address && userData.address.trim() !== '' ? userData.address : null,
        driver_license: userData.driverLicense && userData.driverLicense.trim() !== '' ? userData.driverLicense : null,
      };

      // Determine if this role should have email based on role permissions
      // Only set email for roles that have higher permission counts
      let shouldHaveEmail = true;
      if (defaultRoleId) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_groups')
          .select('name, permissions')
          .eq('role_id', defaultRoleId)
          .single();
        
        if (!roleError && roleData) {
          // Check if this is a basic role (fewer permissions)
          const isBasicRole = roleData.permissions && roleData.permissions.length < 5;
          
          shouldHaveEmail = !isBasicRole;
          console.log('Role analysis:', {
            roleName: roleData.name,
            permissionCount: roleData.permissions?.length || 0,
            isBasicRole,
            shouldHaveEmail
          });
        }
      }

      if (shouldHaveEmail && userData.email && userData.email.trim() !== '') {
        insertData.email = userData.email;
      }

      // Insert user into database
      const { data, error } = await supabase
        .from('users')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding user:', error);
        if (error.code === '42501' || error.message.includes('policy')) {
          throw new Error('You do not have permission to create users');
        }
        throw new Error(`Failed to add user: ${error.message}`);
      }

      // Transform database user to RBAC User format
      const dbUser = data as any;
      const newUser: User = {
        id: dbUser.id.toString(),
        name: dbUser.name || '',
        email: dbUser.email || undefined,
        phone: dbUser.phone || '',
        role_id: dbUser.role_id || null,
        status: dbUser.status as UserStatus,
        createdAt: dbUser.created_at,
        profileImage: dbUser.profile_image || undefined,
        totalTrips: dbUser.total_trips || 0,
        lastTrip: dbUser.last_trip || undefined,
        badgeNumber: dbUser.badge_number || undefined,
        dateOfBirth: dbUser.date_of_birth || undefined,
        placeOfBirth: dbUser.place_of_birth || undefined,
        address: dbUser.address || undefined,
        driverLicense: dbUser.driver_license || undefined,
      };

      // Update local state
      setUsers(prev => [...prev, newUser]);

      console.log('User added to database successfully:', newUser.id);
      return newUser;
    } catch (error) {
      console.error('Error in addUser operation:', error);
      throw error;
    }
  };

  return addUser;
};

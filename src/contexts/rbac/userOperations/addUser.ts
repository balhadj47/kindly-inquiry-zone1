
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
      
      // Get default role_id dynamically from available roles
      let defaultRoleId = userData.role_id;
      if (!defaultRoleId) {
        // Fetch available roles to determine default
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_groups')
          .select('role_id, name')
          .order('role_id', { ascending: true });
        
        if (!rolesError && rolesData && rolesData.length > 0) {
          // Look for employee/user role, otherwise use first available
          const employeeRole = rolesData.find(role => 
            role.name?.toLowerCase().includes('utilisateur') ||
            role.name?.toLowerCase().includes('employee') ||
            role.name?.toLowerCase().includes('employe') ||
            role.name?.toLowerCase().includes('user')
          );
          defaultRoleId = employeeRole?.role_id || rolesData[0].role_id;
          console.log('Using default role_id:', defaultRoleId, 'from available roles');
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
      // Only set email for roles that aren't basic employee roles
      let shouldHaveEmail = true;
      if (defaultRoleId) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_groups')
          .select('name, permissions')
          .eq('role_id', defaultRoleId)
          .single();
        
        if (!roleError && roleData) {
          // Check if this is a basic employee role (limited permissions)
          const isBasicEmployeeRole = roleData.name?.toLowerCase().includes('utilisateur') ||
            roleData.name?.toLowerCase().includes('employee') ||
            roleData.name?.toLowerCase().includes('employe');
          
          shouldHaveEmail = !isBasicEmployeeRole;
          console.log('Role analysis:', {
            roleName: roleData.name,
            isBasicEmployeeRole,
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

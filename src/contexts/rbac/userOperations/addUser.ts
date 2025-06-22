
import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';
import { UserOperationData } from './types';

export const createAddUserOperation = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const addUser = async (userData: UserOperationData) => {
    console.log('Adding user to database:', userData);
    
    try {
      // Streamlined insert data preparation
      const insertData = {
        name: userData.name,
        phone: userData.phone || null,
        email: userData.email?.trim() || null,
        role_id: userData.role_id || 3,
        group_id: userData.group_id || 3,
        status: userData.status || 'Active',
        profile_image: userData.profileImage || null,
        total_trips: userData.totalTrips || 0,
        last_trip: userData.lastTrip || null,
        badge_number: userData.badgeNumber?.trim() || null,
        date_of_birth: userData.dateOfBirth?.trim() || null,
        place_of_birth: userData.placeOfBirth?.trim() || null,
        address: userData.address?.trim() || null,
        driver_license: userData.driverLicense?.trim() || null,
      };

      console.log('Streamlined insert data:', insertData);

      const { data, error } = await supabase
        .from('users')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding user:', error);
        throw new Error(`Failed to add user: ${error.message}`);
      }

      if (data) {
        // Quick user object creation
        const newUser: User = {
          id: data.id.toString(),
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || 'N/A',
          role_id: data.role_id || 3,
          status: data.status as UserStatus,
          createdAt: data.created_at,
          totalTrips: data.total_trips || 0,
          lastTrip: data.last_trip || undefined,
          profileImage: data.profile_image || undefined,
          badgeNumber: data.badge_number || undefined,
          dateOfBirth: data.date_of_birth || undefined,
          placeOfBirth: data.place_of_birth || undefined,
          address: data.address || undefined,
          driverLicense: data.driver_license || undefined,
        };
        
        console.log('User created successfully:', newUser);
        setUsers(prev => [...prev, newUser]);
      }
    } catch (error) {
      console.error('Error in addUser operation:', error);
      throw error;
    }
  };

  return addUser;
};

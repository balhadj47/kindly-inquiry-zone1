
import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';
import { UserOperationData } from './types';

export const createAddUserOperation = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const addUser = async (userData: UserOperationData) => {
    console.log('Adding user to database:', userData);
    
    try {
      const insertData: any = {
        name: userData.name,
        phone: userData.phone || null,
        role_id: userData.role_id || 3,
        group_id: userData.group_id || 3,
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

      if (userData.email && userData.email.trim() !== '') {
        insertData.email = userData.email;
      }

      console.log('Insert data with group_id:', insertData);

      const { data, error } = await supabase
        .from('users')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Supabase error adding user:', error);
        throw new Error(`Failed to add user: ${error.message}`);
      }

      if (data && data[0]) {
        const dbUser = data[0] as any;
        const newUser: User = {
          id: dbUser.id.toString(),
          name: dbUser.name,
          email: dbUser.email || undefined,
          phone: dbUser.phone || 'N/A',
          role_id: dbUser.role_id || 3,
          status: dbUser.status as UserStatus,
          createdAt: dbUser.created_at,
          totalTrips: dbUser.total_trips || 0,
          lastTrip: dbUser.last_trip || undefined,
          profileImage: dbUser.profile_image || undefined,
          badgeNumber: dbUser.badge_number || undefined,
          dateOfBirth: dbUser.date_of_birth || undefined,
          placeOfBirth: dbUser.place_of_birth || undefined,
          address: dbUser.address || undefined,
          driverLicense: dbUser.driver_license || undefined,
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

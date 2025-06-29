
import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';
import { UserOperationData } from './types';

export const createUpdateUserOperation = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const updateUser = async (userId: string, updates: Partial<UserOperationData>): Promise<User> => {
    console.log('Updating user in database:', userId, updates);
    
    try {
      // First check if current user has permission to update users
      const { data: hasPermission, error: permError } = await supabase.rpc('current_user_can_update_users');
      
      if (permError) {
        console.error('Error checking user update permission:', permError);
        throw new Error('Failed to verify permissions');
      }
      
      if (!hasPermission) {
        console.error('User does not have permission to update users');
        throw new Error('You do not have permission to update users');
      }
      
      console.log('User has permission to update users, proceeding...');
      
      // Prepare update data with proper field mapping and null handling for dates
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.role_id !== undefined) updateData.role_id = updates.role_id;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.profileImage !== undefined) updateData.profile_image = updates.profileImage;
      if (updates.totalTrips !== undefined) updateData.total_trips = updates.totalTrips;
      if (updates.lastTrip !== undefined) updateData.last_trip = updates.lastTrip;
      if (updates.badgeNumber !== undefined) updateData.badge_number = updates.badgeNumber;
      
      // Handle date fields - convert empty strings to null
      if (updates.dateOfBirth !== undefined) {
        updateData.date_of_birth = updates.dateOfBirth && updates.dateOfBirth.trim() !== '' ? updates.dateOfBirth : null;
      }
      
      if (updates.placeOfBirth !== undefined) updateData.place_of_birth = updates.placeOfBirth;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.driverLicense !== undefined) updateData.driver_license = updates.driverLicense;

      // Update user in database
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', parseInt(userId))
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating user:', error);
        if (error.code === '42501' || error.message.includes('policy')) {
          throw new Error('You do not have permission to update users');
        }
        throw new Error(`Failed to update user: ${error.message}`);
      }

      // Transform database user to RBAC User format
      const dbUser = data as any;
      const updatedUser: User = {
        id: dbUser.id.toString(),
        name: dbUser.name || '',
        email: dbUser.email || undefined,
        phone: dbUser.phone || '',
        role_id: dbUser.role_id || 3,
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
      setUsers(prev => prev.map(user => 
        user.id === userId ? updatedUser : user
      ));

      console.log('User updated in database successfully:', updatedUser.id);
      return updatedUser;
    } catch (error) {
      console.error('Error in updateUser operation:', error);
      throw error;
    }
  };

  return updateUser;
};

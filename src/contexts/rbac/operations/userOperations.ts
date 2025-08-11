
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';
import { verifyUserUpdatePermission, verifyUserDeletePermission } from './adminOperations';

export const useUserOperations = (
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const [loading, setLoading] = useState(false);

  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    setLoading(true);
    try {
      await verifyUserUpdatePermission();

      const { data, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role_id: userData.role_id,
          status: userData.status as UserStatus,
        })
        .eq('id', parseInt(id))
        .select()
        .single();

      if (error) throw error;

      // Transform database response to User type
      const updatedUser: User = {
        id: data.id.toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role_id: data.role_id,
        status: data.status as UserStatus,
        createdAt: data.created_at,
        licenseNumber: data.driver_license,
        totalTrips: data.total_trips,
        lastTrip: data.last_trip,
        profileImage: data.profile_image,
        badgeNumber: data.badge_number,
        dateOfBirth: data.date_of_birth,
        placeOfBirth: data.place_of_birth,
        address: data.address,
        driverLicense: data.driver_license
      };

      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await verifyUserDeletePermission();

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateUser,
    deleteUser,
  };
};


import { supabase } from '@/integrations/supabase/client';
import type { User, UserRole, UserStatus } from '@/types/rbac';

export const createUserOperations = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const addUser = async (userData: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        group_id: userData.groupId,
        role: userData.role,
        status: userData.status,
        license_number: userData.licenseNumber,
        total_trips: userData.totalTrips || 0,
        last_trip: userData.lastTrip,
        // Note: auth_user_id will be null for manually created users
        // This allows admins to create user profiles that aren't linked to auth accounts
      }])
      .select();

    if (error) {
      console.error('Error adding user:', error);
      throw error;
    }

    if (data && data[0]) {
      const newUser: User = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone,
        groupId: data[0].group_id,
        role: data[0].role as UserRole,
        status: data[0].status as UserStatus,
        createdAt: data[0].created_at,
        licenseNumber: data[0].license_number,
        totalTrips: data[0].total_trips,
        lastTrip: data[0].last_trip,
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        group_id: userData.groupId,
        role: userData.role,
        status: userData.status,
        license_number: userData.licenseNumber,
        total_trips: userData.totalTrips,
        last_trip: userData.lastTrip,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    if (data && data[0]) {
      const updatedUser: User = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone,
        groupId: data[0].group_id,
        role: data[0].role as UserRole,
        status: data[0].status as UserStatus,
        createdAt: data[0].created_at,
        licenseNumber: data[0].license_number,
        totalTrips: data[0].total_trips,
        lastTrip: data[0].last_trip,
      };
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
    }
  };

  const deleteUser = async (id: number) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return { addUser, updateUser, deleteUser };
};

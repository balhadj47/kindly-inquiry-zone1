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
        group_id: userData.groupId || 'employee', // Default to employee group
        role: userData.role || 'Employee', // Default to Employee role
        status: userData.status || 'Active', // Default to Active status
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

  const changeUserPassword = async (email: string, newPassword: string) => {
    // This function is for admin use to change a user's password
    // Note: In production, this would typically be handled by a server-side function
    // For now, we'll use the admin API functions available in Supabase
    
    try {
      // First, we need to find the auth user by email
      const { data: authUsers, error: fetchError } = await supabase.auth.admin.listUsers();
      
      if (fetchError) {
        console.error('Error fetching users:', fetchError);
        throw fetchError;
      }

      const authUser = authUsers.users.find(user => user.email === email);
      
      if (!authUser) {
        throw new Error('User not found');
      }

      // Update the user's password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        authUser.id,
        { password: newPassword }
      );

      if (updateError) {
        console.error('Error updating password:', updateError);
        throw updateError;
      }

      console.log('Password updated successfully for user:', email);
    } catch (error) {
      console.error('Error changing user password:', error);
      throw error;
    }
  };

  return { addUser, updateUser, deleteUser, changeUserPassword };
};


import { supabase } from '@/integrations/supabase/client';
import type { User, UserRole, UserStatus } from '@/types/rbac';

export const createUserOperations = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const addUser = async (userData: Partial<User>) => {
    console.log('Adding user with data:', userData);
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        group_id: userData.groupId || 'employee',
        role: userData.role || 'Employee',
        status: userData.status || 'Active',
        license_number: userData.licenseNumber,
        total_trips: userData.totalTrips || 0,
        last_trip: userData.lastTrip,
        profile_image: userData.profileImage,
      }])
      .select();

    if (error) {
      console.error('Error adding user:', error);
      throw error;
    }

    if (data && data[0]) {
      const newUser: User = {
        id: data[0].id.toString(),
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
        profileImage: data[0].profile_image,
      };
      console.log('User added successfully, updating state:', newUser);
      setUsers(prev => [...prev, newUser]);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    console.log('Updating user with ID:', id, 'Data:', userData);
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
        profile_image: userData.profileImage,
      })
      .eq('id', parseInt(id))
      .select();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    if (data && data[0]) {
      const updatedUser: User = {
        id: data[0].id.toString(),
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
        profileImage: data[0].profile_image,
      };
      console.log('User updated successfully, updating state:', updatedUser);
      setUsers(prev => {
        const newUsers = prev.map(user => user.id === id ? updatedUser : user);
        console.log('Updated users state:', newUsers);
        return newUsers;
      });
    } else {
      console.error('No data returned from update operation');
      throw new Error('Failed to update user - no data returned');
    }
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const changeUserPassword = async (userEmail: string, newPassword: string) => {
    try {
      const { data: authData, error: fetchError } = await supabase.auth.admin.listUsers();
      
      if (fetchError) {
        console.error('Error fetching users:', fetchError);
        throw fetchError;
      }

      const authUser = authData.users.find((user: any) => user.email === userEmail);
      
      if (!authUser) {
        throw new Error('User not found');
      }

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        authUser.id,
        { password: newPassword }
      );

      if (updateError) {
        console.error('Error updating password:', updateError);
        throw updateError;
      }

      console.log('Password updated successfully for user:', userEmail);
    } catch (error) {
      console.error('Error changing user password:', error);
      throw error;
    }
  };

  return { addUser, updateUser, deleteUser, changeUserPassword };
};

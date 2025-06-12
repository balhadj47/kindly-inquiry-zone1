
import { supabase } from '@/integrations/supabase/client';
import type { User, UserRole, UserStatus } from '@/types/rbac';

export const createUserOperations = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const addUser = async (userData: Partial<User>) => {
    console.log('Adding user to database:', userData);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: userData.status || 'Active',
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
        role: data[0].role as UserRole,
        status: data[0].status as UserStatus,
        groupId: 'administrator', // Set admin users to administrator group
        createdAt: data[0].created_at,
        totalTrips: data[0].total_trips || 0,
        lastTrip: data[0].last_trip,
        profileImage: data[0].profile_image,
      };
      
      setUsers(prev => [...prev, newUser]);
      console.log('User added successfully:', newUser.id);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    console.log('Updating user in database:', id, userData);
    
    const { data, error } = await supabase
      .from('users')
      .update({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
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
        role: data[0].role as UserRole,
        status: data[0].status as UserStatus,
        groupId: data[0].role === 'Administrator' ? 'administrator' : 'employee',
        createdAt: data[0].created_at,
        totalTrips: data[0].total_trips || 0,
        lastTrip: data[0].last_trip,
        profileImage: data[0].profile_image,
      };
      
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      console.log('User updated successfully:', updatedUser.id);
      return updatedUser;
    }

    throw new Error('Failed to update user');
  };

  const deleteUser = async (id: string) => {
    console.log('Deleting user from database:', id);
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    setUsers(prev => prev.filter(user => user.id !== id));
    console.log('User deleted successfully:', id);
  };

  const changeUserPassword = async (userEmail: string, newPassword: string) => {
    console.log('Changing password for user:', userEmail);
    
    // Note: This would require admin privileges or a backend function
    // For now, we'll throw an error indicating this needs backend implementation
    throw new Error('Password change requires backend implementation with admin privileges');
  };

  return { addUser, updateUser, deleteUser, changeUserPassword };
};

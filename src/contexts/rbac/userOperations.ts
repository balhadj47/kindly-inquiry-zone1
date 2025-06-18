
import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';
import { SystemGroupName } from '@/types/systemGroups';

export const createUserOperations = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const addUser = async (userData: Partial<User>) => {
    console.log('Adding user to database:', userData);
    
    try {
      const insertData: any = {
        name: userData.name,
        phone: userData.phone,
        role: userData.systemGroup,
        status: userData.status || 'Active',
        profile_image: userData.profileImage,
        total_trips: userData.totalTrips || 0,
        last_trip: userData.lastTrip || null,
      };

      // Only add email if it's provided (not required for employees)
      if (userData.email) {
        insertData.email = userData.email;
      }

      // Note: Employee-specific fields (badge_number, date_of_birth, place_of_birth, address, driver_license) 
      // are not yet added to the database schema. These need to be added as columns to the users table in Supabase.
      console.log('Note: Employee fields not saved to database - columns need to be added to Supabase users table');

      const { data, error } = await supabase
        .from('users')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Supabase error adding user:', error);
        throw new Error(`Failed to add user: ${error.message}`);
      }

      if (data && data[0]) {
        const newUser: User = {
          id: data[0].id.toString(),
          name: data[0].name,
          email: data[0].email || undefined,
          phone: data[0].phone,
          systemGroup: data[0].role as SystemGroupName,
          status: data[0].status as UserStatus,
          createdAt: data[0].created_at,
          totalTrips: data[0].total_trips || 0,
          lastTrip: data[0].last_trip,
          profileImage: data[0].profile_image,
          // Set employee fields from form data since they're not in DB yet
          badgeNumber: userData.badgeNumber,
          dateOfBirth: userData.dateOfBirth,
          placeOfBirth: userData.placeOfBirth,
          address: userData.address,
          driverLicense: userData.driverLicense,
          get role() { return this.systemGroup; }
        };
        
        console.log('User created successfully:', newUser);
        setUsers(prev => [...prev, newUser]);
      }
    } catch (error) {
      console.error('Error in addUser operation:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    console.log('Updating user in database:', id, userData);
    
    try {
      const updateData: any = {
        name: userData.name,
        phone: userData.phone,
        role: userData.systemGroup,
        status: userData.status,
        profile_image: userData.profileImage,
        total_trips: userData.totalTrips,
        last_trip: userData.lastTrip,
      };

      // Only update email if it's provided
      if (userData.email !== undefined) {
        updateData.email = userData.email;
      }

      // Note: Employee-specific fields are not updated in database until columns are added
      console.log('Note: Employee fields not updated in database - columns need to be added to Supabase users table');

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', parseInt(id))
        .select();

      if (error) {
        console.error('Supabase error updating user:', error);
        throw new Error(`Failed to update user: ${error.message}`);
      }

      if (data && data[0]) {
        const updatedUser: User = {
          id: data[0].id.toString(),
          name: data[0].name,
          email: data[0].email || undefined,
          phone: data[0].phone,
          systemGroup: data[0].role as SystemGroupName,
          status: data[0].status as UserStatus,
          createdAt: data[0].created_at,
          totalTrips: data[0].total_trips || 0,
          lastTrip: data[0].last_trip,
          profileImage: data[0].profile_image,
          // Set employee fields from form data since they're not in DB yet
          badgeNumber: userData.badgeNumber,
          dateOfBirth: userData.dateOfBirth,
          placeOfBirth: userData.placeOfBirth,
          address: userData.address,
          driverLicense: userData.driverLicense,
          get role() { return this.systemGroup; }
        };
        
        console.log('User updated successfully:', updatedUser);
        setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
        return updatedUser;
      }

      throw new Error('No data returned from user update');
    } catch (error) {
      console.error('Error in updateUser operation:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    console.log('Deleting user from database:', id);
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', parseInt(id));

      if (error) {
        console.error('Supabase error deleting user:', error);
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      console.log('User deleted from database successfully:', id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error in deleteUser operation:', error);
      throw error;
    }
  };

  const changeUserPassword = async (userEmail: string, newPassword: string) => {
    console.log('Changing password for user:', userEmail);
    throw new Error('Password change requires backend implementation with admin privileges');
  };

  return { addUser, updateUser, deleteUser, changeUserPassword };
};

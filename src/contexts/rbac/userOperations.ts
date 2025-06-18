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

      // Add employee-specific fields if they exist
      if (userData.badgeNumber) insertData.badge_number = userData.badgeNumber;
      if (userData.dateOfBirth) insertData.date_of_birth = userData.dateOfBirth;
      if (userData.placeOfBirth) insertData.place_of_birth = userData.placeOfBirth;
      if (userData.address) insertData.address = userData.address;
      if (userData.driverLicense) insertData.driver_license = userData.driverLicense;

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
          badgeNumber: data[0].badge_number,
          dateOfBirth: data[0].date_of_birth,
          placeOfBirth: data[0].place_of_birth,
          address: data[0].address,
          driverLicense: data[0].driver_license,
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

      // Update employee-specific fields
      if (userData.badgeNumber !== undefined) updateData.badge_number = userData.badgeNumber;
      if (userData.dateOfBirth !== undefined) updateData.date_of_birth = userData.dateOfBirth;
      if (userData.placeOfBirth !== undefined) updateData.place_of_birth = userData.placeOfBirth;
      if (userData.address !== undefined) updateData.address = userData.address;
      if (userData.driverLicense !== undefined) updateData.driver_license = userData.driverLicense;

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
          badgeNumber: data[0].badge_number,
          dateOfBirth: data[0].date_of_birth,
          placeOfBirth: data[0].place_of_birth,
          address: data[0].address,
          driverLicense: data[0].driver_license,
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

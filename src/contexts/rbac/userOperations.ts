
import { supabase } from '@/integrations/supabase/client';
import type { User, UserRole, UserStatus } from '@/types/rbac';

export const createUserOperations = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  // Helper function to determine role_id based on role
  const getRoleIdForRole = (role: UserRole): number => {
    switch (role) {
      case 'Administrator':
        return 1;
      case 'Chef de Groupe Armé':
      case 'Chef de Groupe Sans Armé':
        return 2;
      case 'Chauffeur Armé':
      case 'Chauffeur Sans Armé':
        return 3;
      case 'APS Armé':
      case 'APS Sans Armé':
        return 4;
      default:
        return 5; // Employee
    }
  };

  // Helper function to determine groupId based on role_id
  const getGroupIdForRoleId = (roleId: number): string => {
    switch (roleId) {
      case 1:
        return 'administrator';
      case 2:
        return 'supervisor';
      case 3:
        return 'driver';
      case 4:
        return 'security';
      case 5:
      default:
        return 'employee';
    }
  };

  const addUser = async (userData: Partial<User>) => {
    console.log('Adding user to database:', userData);
    
    try {
      const roleId = userData.role ? getRoleIdForRole(userData.role) : 5;
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          role_id: roleId,
          status: userData.status || 'Active',
          profile_image: userData.profileImage,
          total_trips: userData.totalTrips || 0,
          last_trip: userData.lastTrip || null,
        }])
        .select();

      if (error) {
        console.error('Supabase error adding user:', error);
        throw new Error(`Failed to add user: ${error.message}`);
      }

      if (data && data[0]) {
        const newUser: User = {
          id: data[0].id.toString(),
          name: data[0].name,
          email: data[0].email,
          phone: data[0].phone,
          role: data[0].role as UserRole,
          status: data[0].status as UserStatus,
          groupId: getGroupIdForRoleId(data[0].role_id || 5),
          createdAt: data[0].created_at,
          totalTrips: data[0].total_trips || 0,
          lastTrip: data[0].last_trip,
          profileImage: data[0].profile_image,
        };
        
        console.log('User created successfully:', newUser);
        setUsers(prev => [...prev, newUser]);
        console.log('User added to state successfully:', newUser.id);
      } else {
        throw new Error('No data returned from user creation');
      }
    } catch (error) {
      console.error('Error in addUser operation:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    console.log('Updating user in database:', id, userData);
    
    try {
      const roleId = userData.role ? getRoleIdForRole(userData.role) : undefined;
      
      const updateData: any = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
        profile_image: userData.profileImage,
        total_trips: userData.totalTrips,
        last_trip: userData.lastTrip,
      };

      if (roleId !== undefined) {
        updateData.role_id = roleId;
      }

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
          email: data[0].email,
          phone: data[0].phone,
          role: data[0].role as UserRole,
          status: data[0].status as UserStatus,
          groupId: getGroupIdForRoleId(data[0].role_id || 5),
          createdAt: data[0].created_at,
          totalTrips: data[0].total_trips || 0,
          lastTrip: data[0].last_trip,
          profileImage: data[0].profile_image,
        };
        
        console.log('User updated successfully:', updatedUser);
        setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
        console.log('User updated in state successfully:', updatedUser.id);
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
      console.log('User removed from state successfully:', id);
    } catch (error) {
      console.error('Error in deleteUser operation:', error);
      throw error;
    }
  };

  const changeUserPassword = async (userEmail: string, newPassword: string) => {
    console.log('Changing password for user:', userEmail);
    
    // Note: This would require admin privileges or a backend function
    // For now, we'll throw an error indicating this needs backend implementation
    throw new Error('Password change requires backend implementation with admin privileges');
  };

  return { addUser, updateUser, deleteUser, changeUserPassword };
};

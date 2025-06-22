
import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';
import { UserOperationData } from './types';

export const createUpdateUserOperation = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const updateUser = async (id: string, userData: UserOperationData): Promise<User> => {
    console.log('Updating user in database:', id, userData);
    
    try {
      // First, get the current user to check if they have an auth account
      const { data: currentUserData, error: fetchError } = await supabase
        .from('users')
        .select('email, auth_user_id')
        .eq('id', parseInt(id))
        .single();

      if (fetchError) {
        console.error('Error fetching current user:', fetchError);
        throw new Error(`Failed to fetch current user: ${fetchError.message}`);
      }

      const updateData: any = {
        name: userData.name,
        phone: userData.phone || null,
        role: userData.role_id ? (userData.role_id === 1 ? 'Administrator' : userData.role_id === 2 ? 'Supervisor' : 'Employee') : undefined,
        role_id: userData.role_id || 3,
        status: userData.status,
        profile_image: userData.profileImage || null,
        total_trips: userData.totalTrips || 0,
        last_trip: userData.lastTrip || null,
        badge_number: userData.badgeNumber || null,
        date_of_birth: userData.dateOfBirth && userData.dateOfBirth.trim() !== '' ? userData.dateOfBirth : null,
        place_of_birth: userData.placeOfBirth && userData.placeOfBirth.trim() !== '' ? userData.placeOfBirth : null,
        address: userData.address && userData.address.trim() !== '' ? userData.address : null,
        driver_license: userData.driverLicense && userData.driverLicense.trim() !== '' ? userData.driverLicense : null,
      };

      // Handle email updates
      const emailChanged = userData.email !== undefined && userData.email !== currentUserData.email;
      if (userData.email !== undefined) {
        updateData.email = userData.email && userData.email.trim() !== '' ? userData.email : null;
      }

      // Update the user record first
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', parseInt(id))
        .select();

      if (error) {
        console.error('Supabase error updating user:', error);
        throw new Error(`Failed to update user: ${error.message}`);
      }

      // If user has an auth account and email changed, update auth user
      if (emailChanged && currentUserData.auth_user_id && userData.email) {
        console.log('Updating auth user email for user:', id);
        try {
          const { error: authError } = await supabase.auth.admin.updateUserById(
            currentUserData.auth_user_id,
            { email: userData.email }
          );

          if (authError) {
            console.error('Error updating auth user email:', authError);
            console.warn('User data updated but auth email sync failed. Manual intervention may be required.');
          } else {
            console.log('Auth user email updated successfully');
          }
        } catch (authUpdateError) {
          console.error('Error in auth user update:', authUpdateError);
          console.warn('User data updated but auth email sync failed. Manual intervention may be required.');
        }
      }

      if (data && data[0]) {
        const dbUser = data[0] as any;
        const updatedUser: User = {
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
        
        console.log('User updated successfully, updating state:', updatedUser);
        
        setUsers(prev => {
          console.log('Current users before update:', prev.length);
          const updatedUsers = prev.map(user => user.id === id ? updatedUser : user);
          console.log('Updated users array:', updatedUsers.length);
          return updatedUsers;
        });
        
        return updatedUser;
      }

      throw new Error('No data returned from user update');
    } catch (error) {
      console.error('Error in updateUser operation:', error);
      throw error;
    }
  };

  return updateUser;
};

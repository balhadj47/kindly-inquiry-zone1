import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';

export const createUserOperations = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const addUser = async (userData: Partial<User>) => {
    console.log('Adding user to database:', userData);
    
    try {
      const insertData: any = {
        name: userData.name,
        phone: userData.phone,
        role_id: userData.role_id || 3, // Default to Employee
        status: userData.status || 'Active',
        profile_image: userData.profileImage,
        total_trips: userData.totalTrips || 0,
        last_trip: userData.lastTrip || null,
        badge_number: userData.badgeNumber || null,
        date_of_birth: userData.dateOfBirth && userData.dateOfBirth.trim() !== '' ? userData.dateOfBirth : null,
        place_of_birth: userData.placeOfBirth && userData.placeOfBirth.trim() !== '' ? userData.placeOfBirth : null,
        address: userData.address && userData.address.trim() !== '' ? userData.address : null,
        driver_license: userData.driverLicense && userData.driverLicense.trim() !== '' ? userData.driverLicense : null,
      };

      // Only add email if it's provided (not required for employees)
      if (userData.email && userData.email.trim() !== '') {
        insertData.email = userData.email;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Supabase error adding user:', error);
        throw new Error(`Failed to add user: ${error.message}`);
      }

      if (data && data[0]) {
        const dbUser = data[0] as any;
        const newUser: User = {
          id: dbUser.id.toString(),
          name: dbUser.name,
          email: dbUser.email || undefined,
          phone: dbUser.phone,
          role_id: dbUser.role_id || 3,
          status: dbUser.status as UserStatus,
          createdAt: dbUser.created_at,
          totalTrips: dbUser.total_trips || 0,
          lastTrip: dbUser.last_trip,
          profileImage: dbUser.profile_image,
          badgeNumber: dbUser.badge_number || undefined,
          dateOfBirth: dbUser.date_of_birth || undefined,
          placeOfBirth: dbUser.place_of_birth || undefined,
          address: dbUser.address || undefined,
          driverLicense: dbUser.driver_license || undefined,
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
        phone: userData.phone,
        role_id: userData.role_id || 3,
        status: userData.status,
        profile_image: userData.profileImage,
        total_trips: userData.totalTrips,
        last_trip: userData.lastTrip,
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
          // Note: This requires admin privileges in Supabase
          const { error: authError } = await supabase.auth.admin.updateUserById(
            currentUserData.auth_user_id,
            { email: userData.email }
          );

          if (authError) {
            console.error('Error updating auth user email:', authError);
            // Log warning but don't fail the entire operation
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
          phone: dbUser.phone,
          role_id: dbUser.role_id || 3,
          status: dbUser.status as UserStatus,
          createdAt: dbUser.created_at,
          totalTrips: dbUser.total_trips || 0,
          lastTrip: dbUser.last_trip,
          profileImage: dbUser.profile_image,
          badgeNumber: dbUser.badge_number || undefined,
          dateOfBirth: dbUser.date_of_birth || undefined,
          placeOfBirth: dbUser.place_of_birth || undefined,
          address: dbUser.address || undefined,
          driverLicense: dbUser.driver_license || undefined,
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
      // First, get the user to check if they have an auth account
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('auth_user_id, email')
        .eq('id', parseInt(id))
        .single();

      if (fetchError) {
        console.error('Error fetching user for deletion:', fetchError);
        // Continue with deletion even if we can't fetch user data
      }

      // Delete from users table
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', parseInt(id));

      if (error) {
        console.error('Supabase error deleting user:', error);
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      // If user has an auth account, delete it too
      if (userData?.auth_user_id) {
        console.log('Deleting auth user for user:', id);
        try {
          const { error: authError } = await supabase.auth.admin.deleteUser(
            userData.auth_user_id
          );

          if (authError) {
            console.error('Error deleting auth user:', authError);
            console.warn('User deleted from database but auth user deletion failed. Manual cleanup may be required.');
          } else {
            console.log('Auth user deleted successfully');
          }
        } catch (authDeleteError) {
          console.error('Error in auth user deletion:', authDeleteError);
          console.warn('User deleted from database but auth user deletion failed. Manual cleanup may be required.');
        }
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
    
    try {
      // Check if user exists in our database
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('auth_user_id, id, name')
        .eq('email', userEmail)
        .single();

      if (fetchError) {
        console.error('Error fetching user data:', fetchError);
        throw new Error('Utilisateur non trouvé dans le système');
      }

      // If user has an auth account, try to update password directly via admin API first
      if (userData?.auth_user_id) {
        console.log('Attempting direct password update via admin API for user:', userEmail);
        
        try {
          const { error: adminError } = await supabase.auth.admin.updateUserById(
            userData.auth_user_id,
            { password: newPassword }
          );

          if (!adminError) {
            console.log('Password updated successfully via admin API');
            return;
          }
          
          console.error('Admin API failed:', adminError);
          // If admin API fails, fall back to password reset email
          console.log('Falling back to password reset email...');
          
        } catch (adminUpdateError) {
          console.error('Error in admin password update:', adminUpdateError);
          console.log('Falling back to password reset email...');
        }
      } else {
        // User has no auth account, create one with the new password
        console.log('Creating new auth account for user...');
        
        try {
          const { data: authData, error: createError } = await supabase.auth.admin.createUser({
            email: userEmail,
            password: newPassword,
            email_confirm: true
          });

          if (createError) {
            console.error('Error creating auth user:', createError);
            throw new Error('Impossible de créer le compte utilisateur');
          }

          // Update user record with auth_user_id
          if (authData.user) {
            const { error: updateError } = await supabase
              .from('users')
              .update({ auth_user_id: authData.user.id })
              .eq('id', userData.id);

            if (updateError) {
              console.error('Error updating user with auth_user_id:', updateError);
            }
          }
          
          console.log('New auth account created successfully with password');
          return;
          
        } catch (createError) {
          console.error('Error creating auth account:', createError);
          // Fall back to reset email if account creation fails
          console.log('Falling back to password reset email...');
        }
      }

      // Fallback: send password reset email
      console.log('Sending password reset email to user:', userEmail);
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset-password`
      });

      if (resetError) {
        console.error('Error sending password reset email:', resetError);
        throw new Error('Impossible de changer le mot de passe ou d\'envoyer l\'email de réinitialisation');
      }

      // Throw informational message about email being sent
      throw new Error(`Un email de réinitialisation de mot de passe a été envoyé à ${userEmail}. L'utilisateur devra suivre les instructions dans l'email pour définir son nouveau mot de passe.`);

    } catch (error) {
      console.error('Error in changeUserPassword operation:', error);
      throw error;
    }
  };

  return { addUser, updateUser, deleteUser, changeUserPassword };
};

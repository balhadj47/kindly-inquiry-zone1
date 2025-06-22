
import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';
import { UserOperationData } from './types';

export const createAddUserOperation = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const addUser = async (userData: UserOperationData) => {
    console.log('Adding user to database:', userData);
    
    try {
      // Optimistic update - add to UI immediately for better UX
      const tempUser: User = {
        id: `temp-${Date.now()}`,
        name: userData.name,
        email: userData.email || undefined,
        phone: userData.phone || '',
        role_id: userData.role_id || 2, // Default to Supervisor (2)
        status: userData.status || 'Active',
        createdAt: new Date().toISOString(),
        totalTrips: 0,
        badgeNumber: userData.badgeNumber,
        dateOfBirth: userData.dateOfBirth,
        placeOfBirth: userData.placeOfBirth,
        address: userData.address,
        driverLicense: userData.driverLicense,
      };
      
      setUsers(prev => [...prev, tempUser]);

      // Create auth user first if email is provided
      let authUserId = null;
      if (userData.email && userData.email.trim() !== '') {
        console.log('Creating auth user for:', userData.email);
        
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          email_confirm: true, // Auto-confirm email
        });

        if (authError) {
          console.error('Error creating auth user:', authError);
          // Revert optimistic update
          setUsers(prev => prev.filter(user => user.id !== tempUser.id));
          throw new Error(`Failed to create auth user: ${authError.message}`);
        }

        if (authData?.user) {
          authUserId = authData.user.id;
          console.log('Auth user created with ID:', authUserId);

          // Send password reset email
          try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(userData.email, {
              redirectTo: `${window.location.origin}/reset-password`
            });
            
            if (resetError) {
              console.warn('Password reset email failed:', resetError);
            } else {
              console.log('Password reset email sent to:', userData.email);
            }
          } catch (resetErr) {
            console.warn('Error sending password reset email:', resetErr);
          }
        }
      }

      // Prepare data for database insert
      const insertData = {
        name: userData.name,
        phone: userData.phone || '',
        email: userData.email || '',
        role_id: userData.role_id || 2, // Default to Supervisor (2)
        status: userData.status || 'Active',
        profile_image: userData.profileImage || null,
        total_trips: userData.totalTrips || 0,
        last_trip: userData.lastTrip || null,
        auth_user_id: authUserId,
        badge_number: userData.badgeNumber || null,
        date_of_birth: userData.dateOfBirth && userData.dateOfBirth.trim() !== '' ? userData.dateOfBirth : null,
        place_of_birth: userData.placeOfBirth && userData.placeOfBirth.trim() !== '' ? userData.placeOfBirth : null,
        address: userData.address && userData.address.trim() !== '' ? userData.address : null,
        driver_license: userData.driverLicense && userData.driverLicense.trim() !== '' ? userData.driverLicense : null,
      };

      console.log('Database insert data:', insertData);

      // Insert user into database
      const { data, error } = await supabase
        .from('users')
        .insert(insertData as any)
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding user:', error);
        
        // If auth user was created but database insert failed, clean up auth user
        if (authUserId) {
          try {
            await supabase.auth.admin.deleteUser(authUserId);
            console.log('Cleaned up auth user after database error');
          } catch (cleanupError) {
            console.error('Failed to clean up auth user:', cleanupError);
          }
        }
        
        // Revert optimistic update
        setUsers(prev => prev.filter(user => user.id !== tempUser.id));
        throw new Error(`Failed to add user: ${error.message}`);
      }

      if (data) {
        // Replace temp user with real data
        const newUser: User = {
          id: data.id.toString(),
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || '',
          role_id: data.role_id || 2,
          status: data.status as UserStatus,
          createdAt: data.created_at,
          totalTrips: data.total_trips || 0,
          lastTrip: data.last_trip || undefined,
          profileImage: data.profile_image || undefined,
          badgeNumber: data.badge_number || undefined,
          dateOfBirth: data.date_of_birth || undefined,
          placeOfBirth: data.place_of_birth || undefined,
          address: data.address || undefined,
          driverLicense: data.driver_license || undefined,
        };
        
        console.log('User created successfully:', newUser);
        setUsers(prev => prev.map(user => user.id === tempUser.id ? newUser : user));
      }
    } catch (error) {
      console.error('Error in addUser operation:', error);
      // Make sure to revert optimistic update on any error
      setUsers(prev => prev.filter(user => !user.id.startsWith('temp-')));
      throw error;
    }
  };

  return addUser;
};

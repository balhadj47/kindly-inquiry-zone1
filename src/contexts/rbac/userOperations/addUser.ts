
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

      // Prepare data for database insert - no auth user creation in frontend
      const insertData = {
        name: userData.name,
        phone: userData.phone || '',
        email: userData.email || '',
        role_id: userData.role_id || 2, // Default to Supervisor (2)
        status: userData.status || 'Active',
        profile_image: userData.profileImage || null,
        total_trips: userData.totalTrips || 0,
        last_trip: userData.lastTrip || null,
        badge_number: userData.badgeNumber || null,
        date_of_birth: userData.dateOfBirth && userData.dateOfBirth.trim() !== '' ? userData.dateOfBirth : null,
        place_of_birth: userData.placeOfBirth && userData.placeOfBirth.trim() !== '' ? userData.placeOfBirth : null,
        address: userData.address && userData.address.trim() !== '' ? userData.address : null,
        driver_license: userData.driverLicense && userData.driverLicense.trim() !== '' ? userData.driverLicense : null,
      };

      console.log('Database insert data:', insertData);

      // Insert user into database - RLS policies will handle authorization
      const { data, error } = await supabase
        .from('users')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding user:', error);
        
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

        // Send invitation email via Supabase Edge Function (if email provided)
        if (userData.email && userData.email.trim() !== '') {
          try {
            const { error: inviteError } = await supabase.functions.invoke('send-user-invite', {
              body: {
                email: userData.email,
                name: userData.name,
                userId: data.id
              }
            });
            
            if (inviteError) {
              console.warn('Failed to send invitation email:', inviteError);
            } else {
              console.log('Invitation email sent to:', userData.email);
            }
          } catch (inviteErr) {
            console.warn('Error sending invitation email:', inviteErr);
          }
        }
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

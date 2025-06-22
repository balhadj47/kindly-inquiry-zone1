
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

      // Prepare data for database insert - only use role_id
      const insertData = {
        name: userData.name,
        phone: userData.phone || '',
        email: userData.email || '',
        role_id: userData.role_id || 2,
        status: userData.status || 'Active',
        profile_image: userData.profileImage || null,
        total_trips: userData.totalTrips || 0,
        last_trip: userData.lastTrip || null,
      };

      console.log('Database insert data:', insertData);

      // Insert user into database - cast to any to bypass outdated type definitions
      const { data, error } = await supabase
        .from('users')
        .insert(insertData as any)
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding user:', error);
        
        // Revert optimistic update
        setUsers(prev => prev.filter(user => user.id !== tempUser.id));
        throw new Error(`Failed to add user: ${error.message}`);
      }

      if (data) {
        // Replace temp user with real data - only use fields that exist in the database
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
          // Employee fields - these don't exist in DB yet, so we keep the original values from userData
          badgeNumber: userData.badgeNumber || undefined,
          dateOfBirth: userData.dateOfBirth || undefined,
          placeOfBirth: userData.placeOfBirth || undefined,
          address: userData.address || undefined,
          driverLicense: userData.driverLicense || undefined,
        };
        
        console.log('User created successfully:', newUser);
        setUsers(prev => prev.map(user => user.id === tempUser.id ? newUser : user));

        // Create auth account with default password if email is provided
        if (userData.email && userData.email.trim() !== '') {
          try {
            console.log('Creating auth account for user:', userData.email);
            
            // Generate a default password (user should change this on first login)
            const defaultPassword = 'TempPass123!'; // You can customize this
            
            const { data: authData, error: createError } = await supabase.auth.admin.createUser({
              email: userData.email,
              password: defaultPassword,
              email_confirm: true,
              user_metadata: {
                name: userData.name,
                user_id: data.id
              }
            });

            if (createError) {
              console.error('Error creating auth user:', createError);
              console.log('User was created in database but auth account creation failed');
            } else {
              console.log('Auth account created successfully');
              
              // Update user record with auth_user_id
              if (authData.user) {
                const { error: updateError } = await supabase
                  .from('users')
                  .update({ auth_user_id: authData.user.id })
                  .eq('id', data.id);

                if (updateError) {
                  console.error('Error updating user with auth_user_id:', updateError);
                } else {
                  console.log(`User account created successfully! Email: ${userData.email}, Password: ${defaultPassword}`);
                  alert(`Utilisateur créé avec succès!\n\nEmail: ${userData.email}\nMot de passe temporaire: ${defaultPassword}\n\nL'utilisateur devra changer ce mot de passe lors de sa première connexion.`);
                }
              }
            }
          } catch (authError) {
            console.error('Error in auth account creation:', authError);
            console.log('User was created in database but auth account creation failed');
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

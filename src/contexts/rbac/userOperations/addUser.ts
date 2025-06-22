
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

        // Only attempt to create auth account if email is provided and we have proper permissions
        if (userData.email && userData.email.trim() !== '') {
          try {
            console.log('Attempting to create auth account for user:', userData.email);
            
            // Check if we can create auth users by trying to get the current session
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
              console.log('No active session, skipping auth user creation');
              alert(`Utilisateur créé avec succès dans la base de données!\n\nNote: Aucun compte d'authentification n'a été créé car aucune session admin active n'a été trouvée.\n\nL'utilisateur devra s'inscrire manuellement ou un administrateur avec les permissions appropriées devra créer le compte.`);
              return;
            }

            // Generate a default password (user should change this on first login)
            const defaultPassword = 'TempPass123!';
            
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
              
              // Provide user-friendly error message based on error type
              if (createError.message.includes('not allowed') || createError.message.includes('403')) {
                alert(`Utilisateur créé avec succès dans la base de données!\n\nNote: Le compte d'authentification n'a pas pu être créé car vous n'avez pas les permissions d'administrateur nécessaires.\n\nVeuillez contacter un super-administrateur pour créer le compte d'authentification pour: ${userData.email}`);
              } else {
                alert(`Utilisateur créé avec succès dans la base de données!\n\nNote: Erreur lors de la création du compte d'authentification: ${createError.message}\n\nL'utilisateur peut s'inscrire manuellement avec l'email: ${userData.email}`);
              }
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
            alert(`Utilisateur créé avec succès dans la base de données!\n\nNote: Erreur lors de la création du compte d'authentification.\n\nL'utilisateur peut s'inscrire manuellement avec l'email: ${userData.email}`);
          }
        } else {
          // No email provided, just show success for database user creation
          alert(`Utilisateur créé avec succès dans la base de données!\n\nNote: Aucun email fourni, donc aucun compte d'authentification n'a été créé.`);
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

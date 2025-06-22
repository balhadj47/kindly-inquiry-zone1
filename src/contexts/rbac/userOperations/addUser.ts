
import { supabase, createUserAsAdmin } from '@/integrations/supabase/client';
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

      // Check if email is provided for auth account creation
      if (userData.email && userData.email.trim() !== '') {
        console.log('Creating user with auth account via admin method');
        
        // Generate a temporary password (admin should share this with the user)
        const tempPassword = `TempPass${Math.random().toString(36).slice(-8)}!`;
        
        try {
          const result = await createUserAsAdmin({
            email: userData.email,
            password: tempPassword,
            name: userData.name,
            phone: userData.phone || '',
            role_id: userData.role_id || 2,
            status: userData.status || 'Active',
          });

          // Update with real data from the database
          const newUser: User = {
            id: result.dbUser.id.toString(),
            name: result.dbUser.name,
            email: result.dbUser.email || undefined,
            phone: result.dbUser.phone || '',
            role_id: result.dbUser.role_id || 2,
            status: result.dbUser.status as UserStatus,
            createdAt: result.dbUser.created_at,
            totalTrips: result.dbUser.total_trips || 0,
            lastTrip: result.dbUser.last_trip || undefined,
            profileImage: result.dbUser.profile_image || undefined,
            badgeNumber: userData.badgeNumber || undefined,
            dateOfBirth: userData.dateOfBirth || undefined,
            placeOfBirth: userData.placeOfBirth || undefined,
            address: userData.address || undefined,
            driverLicense: userData.driverLicense || undefined,
          };
          
          console.log('User created successfully with auth account:', newUser);
          setUsers(prev => prev.map(user => user.id === tempUser.id ? newUser : user));

          // Show success message with temporary password
          alert(`✅ Utilisateur créé avec succès!\n\n📧 Email: ${userData.email}\n🔑 Mot de passe temporaire: ${tempPassword}\n\n⚠️ IMPORTANT: Partagez ce mot de passe avec l'utilisateur. Il pourra le changer après sa première connexion.`);
          
        } catch (authError) {
          console.error('Error creating user with auth:', authError);
          
          // Fallback: create database-only user
          console.log('Falling back to database-only user creation');
          
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

          const { data, error } = await supabase
            .from('users')
            .insert(insertData as any)
            .select()
            .single();

          if (error) {
            setUsers(prev => prev.filter(user => user.id !== tempUser.id));
            throw new Error(`Failed to create user: ${error.message}`);
          }

          if (data) {
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
              badgeNumber: userData.badgeNumber || undefined,
              dateOfBirth: userData.dateOfBirth || undefined,
              placeOfBirth: userData.placeOfBirth || undefined,
              address: userData.address || undefined,
              driverLicense: userData.driverLicense || undefined,
            };
            
            setUsers(prev => prev.map(user => user.id === tempUser.id ? newUser : user));
            alert(`⚠️ Utilisateur créé dans la base de données seulement.\n\nErreur lors de la création du compte d'authentification: ${authError instanceof Error ? authError.message : 'Erreur inconnue'}\n\nL'utilisateur pourra s'inscrire manuellement avec l'email: ${userData.email}`);
          }
        }
      } else {
        // No email provided, create database-only user
        console.log('No email provided, creating database-only user');
        
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

        const { data, error } = await supabase
          .from('users')
          .insert(insertData as any)
          .select()
          .single();

        if (error) {
          setUsers(prev => prev.filter(user => user.id !== tempUser.id));
          throw new Error(`Failed to create user: ${error.message}`);
        }

        if (data) {
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
            badgeNumber: userData.badgeNumber || undefined,
            dateOfBirth: userData.dateOfBirth || undefined,
            placeOfBirth: userData.placeOfBirth || undefined,
            address: userData.address || undefined,
            driverLicense: userData.driverLicense || undefined,
          };
          
          setUsers(prev => prev.map(user => user.id === tempUser.id ? newUser : user));
          alert(`✅ Utilisateur créé avec succès dans la base de données!\n\n📝 Note: Aucun email fourni, donc aucun compte d'authentification n'a été créé.`);
        }
      }
    } catch (error) {
      console.error('Error in addUser operation:', error);
      setUsers(prev => prev.filter(user => !user.id.startsWith('temp-')));
      throw error;
    }
  };

  return addUser;
};

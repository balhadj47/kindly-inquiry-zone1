
import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';
import { UserOperationData } from './types';

export const createUpdateUserOperation = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const updateUser = async (userId: string, updates: Partial<UserOperationData>): Promise<User> => {
    console.log('Updating user in database:', userId, updates);
    
    try {
      // First check if current user has permission to update users
      const { data: hasPermission, error: permError } = await supabase.rpc('current_user_can_update_users');
      
      if (permError) {
        console.error('Error checking user update permission:', permError);
        throw new Error('Failed to verify permissions');
      }
      
      if (!hasPermission) {
        console.error('User does not have permission to update users');
        throw new Error('You do not have permission to update users');
      }
      
      console.log('User has permission to update users, proceeding...');
      
      // Prepare update data with proper field mapping and null handling for dates
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      // Only include email if it's provided and not empty
      if (updates.email !== undefined) {
        updateData.email = updates.email?.trim() || null;
      }
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.role_id !== undefined) updateData.role_id = updates.role_id;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.profileImage !== undefined) updateData.profile_image = updates.profileImage;
      if (updates.totalTrips !== undefined) updateData.total_trips = updates.totalTrips;
      if (updates.lastTrip !== undefined) updateData.last_trip = updates.lastTrip;
      if (updates.badgeNumber !== undefined) updateData.badge_number = updates.badgeNumber;
      
      // Handle date fields - convert empty strings to null
      if (updates.dateOfBirth !== undefined) {
        updateData.date_of_birth = updates.dateOfBirth && updates.dateOfBirth.trim() !== '' ? updates.dateOfBirth : null;
      }
      
      if (updates.placeOfBirth !== undefined) updateData.place_of_birth = updates.placeOfBirth;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.driverLicense !== undefined) updateData.driver_license = updates.driverLicense;

      // Handle new fields
      if (updates.identification_national !== undefined) updateData.identification_national = updates.identification_national;
      if (updates.carte_national !== undefined) updateData.carte_national = updates.carte_national;
      if (updates.carte_national_start_date !== undefined) updateData.carte_national_start_date = updates.carte_national_start_date;
      if (updates.carte_national_expiry_date !== undefined) updateData.carte_national_expiry_date = updates.carte_national_expiry_date;
      if (updates.driver_license_start_date !== undefined) updateData.driver_license_start_date = updates.driver_license_start_date;
      if (updates.driver_license_expiry_date !== undefined) updateData.driver_license_expiry_date = updates.driver_license_expiry_date;
      if (updates.driver_license_category !== undefined) updateData.driver_license_category = updates.driver_license_category;
      if (updates.driver_license_category_dates !== undefined) updateData.driver_license_category_dates = updates.driver_license_category_dates;
      if (updates.blood_type !== undefined) updateData.blood_type = updates.blood_type;
      if (updates.company_assignment_date !== undefined) updateData.company_assignment_date = updates.company_assignment_date;

      // Update user in database
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', parseInt(userId))
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating user:', error);
        
        // Handle specific database errors with better messages
        if (error.code === '23505') { // Unique constraint violation
          if (error.message.includes('users_email_unique_idx')) {
            throw new Error('Cette adresse email est déjà utilisée par un autre utilisateur');
          } else {
            throw new Error('Cette valeur est déjà utilisée dans le système');
          }
        } else if (error.code === '42501' || error.message.includes('policy')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour cette action');
        } else if (error.code === '23503') { // Foreign key violation
          throw new Error('Référence invalide dans les données');
        } else if (error.code === '23514') { // Check constraint violation
          throw new Error('Les données ne respectent pas les contraintes de validation');
        } else {
          throw new Error(`Erreur de base de données: ${error.message}`);
        }
      }

      // Transform database user to RBAC User format
      const dbUser = data as any;
      const updatedUser: User = {
        id: dbUser.id.toString(),
        name: dbUser.name || '',
        email: dbUser.email || undefined,
        phone: dbUser.phone || '',
        role_id: dbUser.role_id || 3,
        status: dbUser.status as UserStatus,
        createdAt: dbUser.created_at,
        profileImage: dbUser.profile_image || undefined,
        totalTrips: dbUser.total_trips || 0,
        lastTrip: dbUser.last_trip || undefined,
        badgeNumber: dbUser.badge_number || undefined,
        dateOfBirth: dbUser.date_of_birth || undefined,
        placeOfBirth: dbUser.place_of_birth || undefined,
        address: dbUser.address || undefined,
        driverLicense: dbUser.driver_license || undefined,
        // Include new fields
        identification_national: dbUser.identification_national || undefined,
        carte_national: dbUser.carte_national || undefined,
        carte_national_start_date: dbUser.carte_national_start_date || undefined,
        carte_national_expiry_date: dbUser.carte_national_expiry_date || undefined,
        driver_license_start_date: dbUser.driver_license_start_date || undefined,
        driver_license_expiry_date: dbUser.driver_license_expiry_date || undefined,
        driver_license_category: dbUser.driver_license_category || undefined,
        driver_license_category_dates: dbUser.driver_license_category_dates || undefined,
        blood_type: dbUser.blood_type || undefined,
        company_assignment_date: dbUser.company_assignment_date || undefined,
      };

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? updatedUser : user
      ));

      console.log('User updated in database successfully:', updatedUser.id);
      return updatedUser;
    } catch (error) {
      console.error('Error in updateUser operation:', error);
      throw error; // Re-throw to let the UI handle it
    }
  };

  return updateUser;
};

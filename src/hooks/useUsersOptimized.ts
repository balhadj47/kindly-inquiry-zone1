import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role_id: number; // Changed from role to role_id
  status: string;
  created_at: string;
  auth_user_id?: string;
  profile_image?: string;
  total_trips?: number;
  last_trip?: string;
  badge_number?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  address?: string;
  driver_license?: string;
  // All new fields
  identification_national?: string;
  carte_national?: string;
  carte_national_start_date?: string;
  carte_national_expiry_date?: string;
  driver_license_start_date?: string;
  driver_license_expiry_date?: string;
  driver_license_category?: string[];
  driver_license_category_dates?: any;
  blood_type?: string;
  company_assignment_date?: string;
}

// Base hook for all users with pagination
export const useUsers = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: async (): Promise<{ users: User[]; total: number }> => {
      console.log('👥 useUsersOptimized: Fetching users page', page);
      const startTime = performance.now();
      
      const offset = (page - 1) * limit;
      
      // Get total count
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get paginated users
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('👥 useUsersOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('👥 useUsersOptimized: Fetched in:', endTime - startTime, 'ms');
      
      return {
        users: (data || []).map(user => {
          const dbUser = user as any; // Safe casting to access new fields
          return {
            id: dbUser.id.toString(),
            name: dbUser.name || '',
            email: dbUser.email || undefined,
            phone: dbUser.phone || '',
            role_id: dbUser.role_id || 2, // Use role_id instead of role
            status: dbUser.status || 'Active',
            created_at: dbUser.created_at,
            auth_user_id: dbUser.auth_user_id || '',
            profile_image: dbUser.profile_image || '',
            total_trips: dbUser.total_trips || 0,
            last_trip: dbUser.last_trip || null,
            badge_number: dbUser.badge_number || undefined,
            date_of_birth: dbUser.date_of_birth || undefined,
            place_of_birth: dbUser.place_of_birth || undefined,
            address: dbUser.address || undefined,
            driver_license: dbUser.driver_license || undefined,
            // Map ALL new fields
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
        }),
        total: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for users by role_id - EXCLUDE users with auth accounts for employees
export const useUsersByRoleId = (roleId: number | null) => {
  return useQuery({
    queryKey: ['users', 'role_id', roleId],
    queryFn: async (): Promise<User[]> => {
      if (!roleId) return [];
      
      console.log('👥 useUsersOptimized: Fetching users by role_id:', roleId);
      const startTime = performance.now();
      
      let query = supabase
        .from('users')
        .select('*')
        .eq('role_id', roleId)
        .eq('status', 'Active')
        .order('name');

      // For employees (role_id: 3), exclude users who have auth accounts
      if (roleId === 3) {
        query = query.is('auth_user_id', null);
        console.log('👥 useUsersOptimized: Filtering out auth users for employees');
      }

      const { data, error } = await query;

      if (error) {
        console.error('👥 useUsersOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('👥 useUsersOptimized: Fetched users by role_id in:', endTime - startTime, 'ms');
      
      return (data || []).map(user => {
        const dbUser = user as any; // Safe casting to access new fields
        console.log('🔄 useUsersOptimized: Raw user from DB:', dbUser);
        
        const transformedUser = {
          id: dbUser.id.toString(),
          name: dbUser.name || '',
          email: dbUser.email || undefined,
          phone: dbUser.phone || '',
          role_id: dbUser.role_id || 2, // Use role_id instead of role
          status: dbUser.status || 'Active',
          created_at: dbUser.created_at,
          auth_user_id: dbUser.auth_user_id || '',
          profile_image: dbUser.profile_image || '',
          total_trips: dbUser.total_trips || 0,
          last_trip: dbUser.last_trip || null,
          badge_number: dbUser.badge_number || undefined,
          date_of_birth: dbUser.date_of_birth || undefined,
          place_of_birth: dbUser.place_of_birth || undefined,
          address: dbUser.address || undefined,
          driver_license: dbUser.driver_license || undefined,
          // Include ALL new fields with proper mapping
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
        
        console.log('✅ useUsersOptimized: Transformed user with all fields:', transformedUser);
        return transformedUser;
      });
    },
    enabled: !!roleId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (userId: string | null) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async (): Promise<User | null> => {
      if (!userId) return null;
      
      console.log('👥 useUsersOptimized: Fetching user:', userId);
      const startTime = performance.now();
      
      const numericId = parseInt(userId, 10);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', numericId)
        .single();

      if (error) {
        console.error('👥 useUsersOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('👥 useUsersOptimized: Fetched user in:', endTime - startTime, 'ms');
      
      const dbUser = data as any; // Safe casting to access new fields
      return {
        id: dbUser.id.toString(),
        name: dbUser.name || '',
        email: dbUser.email || undefined,
        phone: dbUser.phone || '',
        role_id: dbUser.role_id || 2, // Use role_id instead of role
        status: dbUser.status || 'Active',
        created_at: dbUser.created_at,
        auth_user_id: dbUser.auth_user_id || '',
        profile_image: dbUser.profile_image || '',
        total_trips: dbUser.total_trips || 0,
        last_trip: dbUser.last_trip || null,
        badge_number: dbUser.badge_number || undefined,
        date_of_birth: dbUser.date_of_birth || undefined,
        place_of_birth: dbUser.place_of_birth || undefined,
        address: dbUser.address || undefined,
        driver_license: dbUser.driver_license || undefined,
        // Include ALL new fields
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
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUserMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const updateUser = useMutation({
    mutationFn: async ({ id, ...userData }: Partial<User> & { id: string }) => {
      const numericId = parseInt(id, 10);
      
      const updateData: any = {
        name: userData.name,
        phone: userData.phone,
        role_id: userData.role_id, // Use role_id instead of role
        status: userData.status,
        badge_number: userData.badge_number || null,
        date_of_birth: userData.date_of_birth && userData.date_of_birth.trim() !== '' ? userData.date_of_birth : null,
        place_of_birth: userData.place_of_birth && userData.place_of_birth.trim() !== '' ? userData.place_of_birth : null,
        address: userData.address && userData.address.trim() !== '' ? userData.address : null,
        driver_license: userData.driver_license && userData.driver_license.trim() !== '' ? userData.driver_license : null,
        // Include ALL new fields in updates
        identification_national: userData.identification_national && userData.identification_national.trim() !== '' ? userData.identification_national : null,
        carte_national: userData.carte_national && userData.carte_national.trim() !== '' ? userData.carte_national : null,
        carte_national_start_date: userData.carte_national_start_date && userData.carte_national_start_date.trim() !== '' ? userData.carte_national_start_date : null,
        carte_national_expiry_date: userData.carte_national_expiry_date && userData.carte_national_expiry_date.trim() !== '' ? userData.carte_national_expiry_date : null,
        driver_license_start_date: userData.driver_license_start_date && userData.driver_license_start_date.trim() !== '' ? userData.driver_license_start_date : null,
        driver_license_expiry_date: userData.driver_license_expiry_date && userData.driver_license_expiry_date.trim() !== '' ? userData.driver_license_expiry_date : null,
        driver_license_category: userData.driver_license_category || null,
        driver_license_category_dates: userData.driver_license_category_dates || null,
        blood_type: userData.blood_type && userData.blood_type.trim() !== '' ? userData.blood_type : null,
        company_assignment_date: userData.company_assignment_date && userData.company_assignment_date.trim() !== '' ? userData.company_assignment_date : null,
      };

      // Only update email if it's provided
      if (userData.email !== undefined) {
        updateData.email = userData.email && userData.email.trim() !== '' ? userData.email : null;
      }
      
      // Only update profile_image if it's provided
      if (userData.profileImage !== undefined) {
        updateData.profile_image = userData.profileImage;
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', numericId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateUsers();
      toast({
        title: 'Succès',
        description: 'Utilisateur modifié avec succès',
      });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const numericId = parseInt(userId, 10);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', numericId);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateUsers();
      toast({
        title: 'Succès',
        description: 'Utilisateur supprimé avec succès',
      });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  return {
    updateUser,
    deleteUser,
    invalidateUsers,
  };
};

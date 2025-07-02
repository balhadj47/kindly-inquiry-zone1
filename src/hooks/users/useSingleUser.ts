
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

export const useUser = (userId: string | null) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async (): Promise<User | null> => {
      if (!userId) return null;
      
      console.log('👥 useSingleUser: Fetching user:', userId);
      const startTime = performance.now();
      
      const numericId = parseInt(userId, 10);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', numericId)
        .single();

      if (error) {
        console.error('👥 useSingleUser: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('👥 useSingleUser: Fetched user in:', endTime - startTime, 'ms');
      
      const dbUser = data as any;
      return {
        id: dbUser.id.toString(),
        name: dbUser.name || '',
        email: dbUser.email || undefined,
        phone: dbUser.phone || '',
        role_id: dbUser.role_id || 2,
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

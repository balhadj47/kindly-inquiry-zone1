
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

export const useUsersByRoleId = (roleId: number) => {
  return useQuery({
    queryKey: ['users', 'role_id', roleId],
    queryFn: async () => {
      // Simplified query - only fetch essential fields initially
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          phone,
          status,
          created_at,
          role_id,
          badge_number,
          profile_image,
          total_trips,
          last_trip,
          date_of_birth,
          place_of_birth,
          address,
          driver_license,
          identification_national,
          carte_national,
          carte_national_start_date,
          carte_national_expiry_date,
          driver_license_start_date,
          driver_license_expiry_date,
          driver_license_category,
          driver_license_category_dates,
          blood_type,
          company_assignment_date
        `)
        .eq('role_id', roleId)
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

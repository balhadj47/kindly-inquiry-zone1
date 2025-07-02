
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

// Hook for users by role_id - EXCLUDE users with auth accounts for employees
export const useUsersByRoleId = (roleId: number | null) => {
  return useQuery({
    queryKey: ['users', 'role_id', roleId],
    queryFn: async (): Promise<User[]> => {
      if (!roleId) return [];
      
      console.log('👥 useUsersByRole: Fetching users by role_id:', roleId);
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
        console.log('👥 useUsersByRole: Filtering out auth users for employees');
      }

      const { data, error } = await query;

      if (error) {
        console.error('👥 useUsersByRole: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('👥 useUsersByRole: Fetched users by role_id in:', endTime - startTime, 'ms');
      
      return (data || []).map(user => {
        const dbUser = user as any;
        console.log('🔄 useUsersByRole: Raw user from DB:', dbUser);
        
        const transformedUser = {
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
        
        console.log('✅ useUsersByRole: Transformed user with all fields:', transformedUser);
        return transformedUser;
      });
    },
    enabled: !!roleId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

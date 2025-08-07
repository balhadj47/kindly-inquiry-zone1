
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, UsersQueryResult } from './types';

// Base hook for all users with pagination
export const useUsers = (page = 1, limit = 50) => { // Increased limit to get more users
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: async (): Promise<UsersQueryResult> => {
      console.log('👥 useUsersQuery: Fetching users page', page);
      const startTime = performance.now();
      
      const offset = (page - 1) * limit;
      
      // Get total count
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get paginated users - removed status filter to get all users
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('👥 useUsersQuery: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('👥 useUsersQuery: Fetched', data?.length || 0, 'users in:', endTime - startTime, 'ms');
      console.log('👥 useUsersQuery: First few users:', data?.slice(0, 3).map(u => ({ id: u.id, name: u.name })));
      
      return {
        users: (data || []).map(user => transformDbUserToUser(user)),
        total: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Helper function to transform database user to User interface
const transformDbUserToUser = (dbUser: any): User => {
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
};

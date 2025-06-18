import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
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
            role: dbUser.role || '',
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
          };
        }),
        total: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for users by role
export const useUsersByRole = (role: string | null) => {
  return useQuery({
    queryKey: ['users', 'role', role],
    queryFn: async (): Promise<User[]> => {
      if (!role) return [];
      
      console.log('👥 useUsersOptimized: Fetching users by role:', role);
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', role)
        .eq('status', 'Active')
        .order('name');

      if (error) {
        console.error('👥 useUsersOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('👥 useUsersOptimized: Fetched users by role in:', endTime - startTime, 'ms');
      
      return (data || []).map(user => {
        const dbUser = user as any; // Safe casting to access new fields
        return {
          id: dbUser.id.toString(),
          name: dbUser.name || '',
          email: dbUser.email || undefined,
          phone: dbUser.phone || '',
          role: dbUser.role || '',
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
        };
      });
    },
    enabled: !!role,
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
        role: dbUser.role || '',
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
        role: userData.role,
        status: userData.status,
        badge_number: userData.badge_number || null,
        date_of_birth: userData.date_of_birth && userData.date_of_birth.trim() !== '' ? userData.date_of_birth : null,
        place_of_birth: userData.place_of_birth && userData.place_of_birth.trim() !== '' ? userData.place_of_birth : null,
        address: userData.address && userData.address.trim() !== '' ? userData.address : null,
        driver_license: userData.driver_license && userData.driver_license.trim() !== '' ? userData.driver_license : null,
      };

      // Only update email if it's provided
      if (userData.email !== undefined) {
        updateData.email = userData.email && userData.email.trim() !== '' ? userData.email : null;
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

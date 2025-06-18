
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
  auth_user_id?: string;
  profile_image?: string;
  total_trips?: number;
  last_trip?: string;
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
        users: (data || []).map(user => ({
          id: user.id.toString(),
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || '',
          status: user.status || 'Active',
          created_at: user.created_at,
          auth_user_id: user.auth_user_id || '',
          profile_image: user.profile_image || '',
          total_trips: user.total_trips || 0,
          last_trip: user.last_trip || null,
        })),
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
      
      return (data || []).map(user => ({
        id: user.id.toString(),
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        status: user.status || 'Active',
        created_at: user.created_at,
        auth_user_id: user.auth_user_id || '',
        profile_image: user.profile_image || '',
        total_trips: user.total_trips || 0,
        last_trip: user.last_trip || null,
      }));
    },
    enabled: !!role,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for a single user
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
      
      return {
        id: data.id.toString(),
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        role: data.role || '',
        status: data.status || 'Active',
        created_at: data.created_at,
        auth_user_id: data.auth_user_id || '',
        profile_image: data.profile_image || '',
        total_trips: data.total_trips || 0,
        last_trip: data.last_trip || null,
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutations for user operations
export const useUserMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const updateUser = useMutation({
    mutationFn: async ({ id, ...userData }: Partial<User> & { id: string }) => {
      const numericId = parseInt(id, 10);
      
      const { data, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          status: userData.status,
        })
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

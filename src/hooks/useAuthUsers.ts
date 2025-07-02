
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  phone: string | null;
  role: string;
  user_metadata: any;
}

export const useAuthUsers = () => {
  return useQuery({
    queryKey: ['auth-users'],
    queryFn: async (): Promise<AuthUser[]> => {
      console.log('🔍 useAuthUsers: Fetching auth users via Edge Function...');
      const startTime = performance.now();
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.error('🔴 useAuthUsers: No session found');
          throw new Error('No session found');
        }

        console.log('🔍 useAuthUsers: Session found, invoking function...');
        const { data, error } = await supabase.functions.invoke('auth-users', {
          method: 'GET',
        });

        if (error) {
          console.error('🔴 useAuthUsers: Function invoke error:', error);
          if (error.message.includes('403') || error.message.includes('Insufficient permissions')) {
            throw new Error('Insufficient permissions');
          }
          throw error;
        }

        const endTime = performance.now();
        console.log('🔍 useAuthUsers: Fetched in:', endTime - startTime, 'ms');
        console.log('🔍 useAuthUsers: Data received:', data);
        
        return data.users || [];
      } catch (err) {
        console.error('🔴 useAuthUsers: Exception in queryFn:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      console.error(`🔴 useAuthUsers: Retry ${failureCount} for error:`, error);
      // Don't retry on permission errors
      if (error.message.includes('Insufficient permissions')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useAuthUserMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateAuthUsers = () => {
    console.log('🔄 Invalidating auth users cache...');
    queryClient.invalidateQueries({ queryKey: ['auth-users'] });
  };

  const deleteAuthUser = useMutation({
    mutationFn: async (userId: string) => {
      console.log('🗑️ Deleting auth user:', userId);
      
      try {
        const { data, error } = await supabase.functions.invoke('auth-users', {
          method: 'DELETE',
          body: { userId },
        });

        if (error) {
          console.error('🔴 Delete error:', error);
          throw new Error(error.message || 'Erreur lors de la suppression');
        }

        console.log('✅ Delete successful:', data);
        return data;
      } catch (err) {
        console.error('🔴 Exception in deleteAuthUser:', err);
        throw err;
      }
    },
    onSuccess: () => {
      invalidateAuthUsers();
      toast({
        title: 'Succès',
        description: 'Utilisateur d\'authentification supprimé avec succès',
      });
    },
    onError: (error) => {
      console.error('🔴 Error deleting auth user:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la suppression: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateAuthUser = useMutation({
    mutationFn: async ({ userId, updateData }: { userId: string; updateData: { email?: string; role_id?: number; name?: string } }) => {
      console.log('📝 Updating auth user:', userId, updateData);
      
      try {
        const { data, error } = await supabase.functions.invoke('auth-users', {
          method: 'PUT',
          body: { userId, updateData },
        });

        if (error) {
          console.error('🔴 Update error:', error);
          throw new Error(error.message || 'Erreur lors de la modification');
        }

        console.log('✅ Update successful:', data);
        return data;
      } catch (err) {
        console.error('🔴 Exception in updateAuthUser:', err);
        throw err;
      }
    },
    onSuccess: () => {
      invalidateAuthUsers();
      // Also invalidate permissions cache to refresh user permissions
      console.log('🔄 Invalidating permissions cache after user update...');
      queryClient.invalidateQueries({ queryKey: ['secure-current-user'] });
      queryClient.invalidateQueries({ queryKey: ['secure-admin-status'] });
      queryClient.invalidateQueries({ queryKey: ['secure-permissions'] });
      
      toast({
        title: 'Succès',
        description: 'Utilisateur d\'authentification modifié avec succès',
      });
    },
    onError: (error) => {
      console.error('🔴 Error updating auth user:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la modification: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const createAuthUser = useMutation({
    mutationFn: async (userData: { email: string; password: string; name: string; role_id: number }) => {
      console.log('🆕 Creating new auth user:', userData.email);
      
      try {
        const { data, error } = await supabase.functions.invoke('auth-users', {
          method: 'POST',
          body: userData,
        });

        if (error) {
          console.error('🔴 Create error:', error);
          throw new Error(error.message || 'Erreur lors de la création');
        }

        console.log('✅ Create successful:', data);
        return data;
      } catch (err) {
        console.error('🔴 Exception in createAuthUser:', err);
        throw err;
      }
    },
    onSuccess: () => {
      invalidateAuthUsers();
      toast({
        title: 'Succès',
        description: 'Utilisateur d\'authentification créé avec succès',
      });
    },
    onError: (error) => {
      console.error('🔴 Error creating auth user:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la création: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    deleteAuthUser,
    updateAuthUser,
    createAuthUser,
    invalidateAuthUsers,
  };
};

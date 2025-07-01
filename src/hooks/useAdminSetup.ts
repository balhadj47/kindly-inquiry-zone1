
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useAdminSetup = () => {
  const queryClient = useQueryClient();

  // Check available roles
  const { data: roles = [] } = useQuery({
    queryKey: ['user-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_groups')
        .select('*')
        .order('role_id');
      
      if (error) {
        console.error('❌ Error fetching roles:', error);
        return [];
      }
      
      console.log('🔍 Available roles:', data);
      return data || [];
    },
  });

  // Create admin role if it doesn't exist
  const createAdminRole = useMutation({
    mutationFn: async () => {
      console.log('🔧 Creating admin role...');
      
      const adminPermissions = [
        'dashboard:read',
        'companies:read',
        'companies:create', 
        'companies:update',
        'companies:delete',
        'vans:read',
        'vans:create',
        'vans:update', 
        'vans:delete',
        'users:read',
        'users:create',
        'users:update',
        'users:delete',
        'trips:read',
        'trips:create',
        'trips:update',
        'trips:delete',
        'auth-users:read'
      ];

      const { data, error } = await supabase
        .from('user_groups')
        .insert({
          id: 'admin-role-1',
          name: 'Administrator',
          description: 'Full system access',
          color: '#dc2626',
          role_id: 1,
          permissions: adminPermissions
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating admin role:', error);
        throw error;
      }

      console.log('✅ Admin role created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
    }
  });

  // Assign user to admin role
  const assignUserToAdmin = useMutation({
    mutationFn: async (userId: number) => {
      console.log('🔧 Assigning user to admin role...', userId);
      
      const { data, error } = await supabase
        .from('users')
        .update({ role_id: 1 })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error assigning user to admin:', error);
        throw error;
      }

      console.log('✅ User assigned to admin:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-current-user'] });
      queryClient.invalidateQueries({ queryKey: ['secure-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-role-debug'] });
    }
  });

  return {
    roles,
    createAdminRole,
    assignUserToAdmin,
  };
};

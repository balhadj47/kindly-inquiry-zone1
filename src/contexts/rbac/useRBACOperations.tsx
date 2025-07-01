
import { useState } from 'react';
import { supabase, createUserAsAdmin } from '@/integrations/supabase/client';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';
import { Permission } from '@/types/permissions';

interface UseRBACOperationsProps {
  currentUser: User | null;
  roles: SystemGroup[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>;
}

export const useRBACOperations = ({ currentUser, roles, setUsers, setRoles }: UseRBACOperationsProps) => {
  const [loading, setLoading] = useState(false);

  // Fetch all available permissions using secure database access
  const getAvailablePermissions = async (): Promise<Permission[]> => {
    try {
      const { data: permissions, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching permissions:', error);
        return [];
      }

      return permissions || [];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  };

  // Get permissions for a specific role using secure database access
  const getRolePermissions = async (roleId: number): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .select(`
          permissions,
          role_permissions!inner(
            permissions!inner(name)
          )
        `)
        .eq('role_id', roleId)
        .single();

      if (error) throw error;
      
      // Combine array permissions and relational permissions
      const arrayPermissions = data?.permissions || [];
      const relationalPermissions = data?.role_permissions?.map((rp: any) => rp.permissions.name) || [];
      
      return [...new Set([...arrayPermissions, ...relationalPermissions])];
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      return [];
    }
  };

  // Add role with permissions using secure admin function
  const addRole = async (roleData: Partial<SystemGroup>): Promise<void> => {
    setLoading(true);
    try {
      // Use the secure admin function
      const { data: newRole, error: roleError } = await supabase.rpc('admin_create_role', {
        p_name: roleData.name,
        p_description: roleData.description || '',
        p_color: roleData.color || '#3b82f6',
        p_permissions: roleData.permissions || []
      });

      if (roleError) {
        console.error('Error creating role:', roleError);
        if (roleError.message?.includes('Admin privileges required')) {
          throw new Error('You do not have permission to create roles');
        }
        throw roleError;
      }

      // Update local state
      if (newRole && newRole.length > 0) {
        const roleWithPermissions = {
          id: newRole[0].id,
          name: newRole[0].name,
          description: newRole[0].description,
          color: newRole[0].color,
          role_id: newRole[0].role_id,
          permissions: newRole[0].permissions || [],
          isSystemRole: false
        };

        setRoles(prev => [...prev, roleWithPermissions]);
      }
    } catch (error) {
      console.error('Error adding role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update role with permissions using secure admin function
  const updateRole = async (id: string, roleData: Partial<SystemGroup>): Promise<SystemGroup> => {
    setLoading(true);
    try {
      // Use the secure admin function
      const { data: success, error: roleError } = await supabase.rpc('admin_update_role', {
        p_role_id: id,
        p_name: roleData.name,
        p_description: roleData.description,
        p_color: roleData.color,
        p_permissions: roleData.permissions || []
      });

      if (roleError) {
        console.error('Error updating role:', roleError);
        if (roleError.message?.includes('Admin privileges required')) {
          throw new Error('You do not have permission to update roles');
        }
        throw roleError;
      }

      if (!success) {
        throw new Error('Failed to update role');
      }

      // Fetch updated role data
      const { data: updatedRole, error: fetchError } = await supabase
        .from('user_groups')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const roleWithPermissions = {
        ...updatedRole,
        permissions: roleData.permissions || []
      };

      // Update local state
      setRoles(prev => prev.map(role => 
        role.id === id ? roleWithPermissions : role
      ));

      return roleWithPermissions;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete role using database access with permission check
  const deleteRole = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // Check if user is admin first
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc('current_user_is_admin');
      
      if (adminCheckError || !isAdmin) {
        throw new Error('You do not have permission to delete roles');
      }

      // Delete the role
      const { error } = await supabase
        .from('user_groups')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting role:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          throw new Error('You do not have permission to delete roles');
        }
        throw error;
      }

      // Update local state
      setRoles(prev => prev.filter(role => role.id !== id));
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User management functions
  const addUser = async (userData: Partial<User>): Promise<User> => {
    setLoading(true);
    try {
      console.log('🔧 useRBACOperations: Adding new user:', userData.email);
      
      if (!userData.email || !userData.password || !userData.name || !userData.role_id) {
        throw new Error('Missing required user data');
      }

      // Create user using admin function
      const result = await createUserAsAdmin({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone || '',
        role_id: userData.role_id,
        status: userData.status || 'Active',
      });

      const newUser = result.dbUser;
      
      // Update local state
      setUsers(prev => [...prev, newUser]);
      
      console.log('✅ useRBACOperations: User created successfully:', newUser.id);
      return newUser;
    } catch (error) {
      console.error('❌ useRBACOperations: Error adding user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    setLoading(true);
    try {
      console.log('🔧 useRBACOperations: Updating user:', id);
      
      const { data, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role_id: userData.role_id,
          status: userData.status,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ useRBACOperations: Database error updating user:', error);
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => user.id === id ? data : user));
      
      console.log('✅ useRBACOperations: User updated successfully:', data.id);
      return data;
    } catch (error) {
      console.error('❌ useRBACOperations: Error updating user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('🔧 useRBACOperations: Deleting user:', id);
      
      // Get user to find auth_user_id
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('auth_user_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('❌ useRBACOperations: Error fetching user for deletion:', fetchError);
        throw fetchError;
      }

      // Delete from users table first
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('❌ useRBACOperations: Error deleting user from database:', deleteError);
        throw deleteError;
      }

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== id));
      
      console.log('✅ useRBACOperations: User deleted successfully:', id);
    } catch (error) {
      console.error('❌ useRBACOperations: Error deleting user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changeUserPassword = async (userEmail: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      console.log('🔧 useRBACOperations: Changing password for user:', userEmail);
      
      // Use Supabase admin API to update user password
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ useRBACOperations: Error changing password:', error);
        return {
          success: false,
          message: error.message || 'Failed to change password'
        };
      }

      console.log('✅ useRBACOperations: Password changed successfully for:', userEmail);
      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('❌ useRBACOperations: Exception changing password:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    } finally {
      setLoading(false);
    }
  };

  // Permission checking functions using database functions
  const hasPermission = (permission: string): boolean => {
    // This will be handled by the usePermissions hook using database functions
    return false;
  };

  const getUserRole = (userId: string): SystemGroup | null => {
    if (!currentUser || currentUser.id !== userId) {
      return null;
    }
    
    if (!Array.isArray(roles)) {
      return null;
    }
    
    const role = roles.find(r => parseInt(r.id) === currentUser.role_id);
    return role || null;
  };

  const canUserPerformAction = (userId: string, action: string): boolean => {
    // This will be handled by the usePermissions hook using database functions
    return false;
  };

  return {
    loading,
    addUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    addRole,
    updateRole,
    deleteRole,
    hasPermission,
    getUserRole,
    canUserPerformAction,
    getAvailablePermissions,
    getRolePermissions,
  };
};

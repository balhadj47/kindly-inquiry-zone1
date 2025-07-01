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

  // Fetch all available permissions (mock implementation for now)
  const getAvailablePermissions = async (): Promise<Permission[]> => {
    try {
      // Return mock permissions matching the new structure
      const mockPermissions: Permission[] = [
        { id: 1, name: 'dashboard:read', description: 'View dashboard', category: 'dashboard', created_at: new Date().toISOString() },
        { id: 2, name: 'companies:read', description: 'View companies', category: 'companies', created_at: new Date().toISOString() },
        { id: 3, name: 'companies:create', description: 'Create companies', category: 'companies', created_at: new Date().toISOString() },
        { id: 4, name: 'companies:update', description: 'Update companies', category: 'companies', created_at: new Date().toISOString() },
        { id: 5, name: 'companies:delete', description: 'Delete companies', category: 'companies', created_at: new Date().toISOString() },
        { id: 6, name: 'vans:read', description: 'View vans', category: 'vans', created_at: new Date().toISOString() },
        { id: 7, name: 'vans:create', description: 'Create vans', category: 'vans', created_at: new Date().toISOString() },
        { id: 8, name: 'vans:update', description: 'Update vans', category: 'vans', created_at: new Date().toISOString() },
        { id: 9, name: 'vans:delete', description: 'Delete vans', category: 'vans', created_at: new Date().toISOString() },
        { id: 10, name: 'users:read', description: 'View users', category: 'users', created_at: new Date().toISOString() },
        { id: 11, name: 'users:create', description: 'Create users', category: 'users', created_at: new Date().toISOString() },
        { id: 12, name: 'users:update', description: 'Update users', category: 'users', created_at: new Date().toISOString() },
        { id: 13, name: 'users:delete', description: 'Delete users', category: 'users', created_at: new Date().toISOString() },
        { id: 14, name: 'trips:read', description: 'View trips', category: 'trips', created_at: new Date().toISOString() },
        { id: 15, name: 'trips:create', description: 'Create trips', category: 'trips', created_at: new Date().toISOString() },
        { id: 16, name: 'trips:update', description: 'Update trips', category: 'trips', created_at: new Date().toISOString() },
        { id: 17, name: 'trips:delete', description: 'Delete trips', category: 'trips', created_at: new Date().toISOString() },
        { id: 18, name: 'auth-users:read', description: 'View auth users', category: 'auth-users', created_at: new Date().toISOString() },
        { id: 19, name: 'groups:read', description: 'View system groups', category: 'groups', created_at: new Date().toISOString() },
        { id: 20, name: 'groups:manage', description: 'Manage system groups', category: 'groups', created_at: new Date().toISOString() },
      ];

      return mockPermissions;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  };

  // Get permissions for a specific role (using legacy array for now)
  const getRolePermissions = async (roleId: number): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .select('permissions')
        .eq('role_id', roleId)
        .single();

      if (error) throw error;
      return data?.permissions || [];
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      return [];
    }
  };

  // Add role with permissions
  const addRole = async (roleData: Partial<SystemGroup>): Promise<void> => {
    setLoading(true);
    try {
      // Create the role in user_groups (keeping existing structure for compatibility)
      const { data: newRole, error: roleError } = await supabase
        .from('user_groups')
        .insert({
          name: roleData.name,
          description: roleData.description || '',
          color: roleData.color || '#3b82f6',
          role_id: roleData.role_id,
          permissions: roleData.permissions || []
        })
        .select()
        .single();

      if (roleError) throw roleError;

      // Update local state
      const roleWithPermissions = {
        ...newRole,
        permissions: roleData.permissions || []
      };

      setRoles(prev => [...prev, roleWithPermissions]);
    } catch (error) {
      console.error('Error adding role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update role with permissions
  const updateRole = async (id: string, roleData: Partial<SystemGroup>): Promise<SystemGroup> => {
    setLoading(true);
    try {
      // Update the role in user_groups
      const { data: updatedRole, error: roleError } = await supabase
        .from('user_groups')
        .update({
          name: roleData.name,
          description: roleData.description,
          color: roleData.color,
          permissions: roleData.permissions || []
        })
        .eq('id', id)
        .select()
        .single();

      if (roleError) throw roleError;

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

  // Delete role
  const deleteRole = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // Delete the role
      const { error } = await supabase
        .from('user_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

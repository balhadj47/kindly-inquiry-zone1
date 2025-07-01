
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserStatus } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

/**
 * SECURE RBAC OPERATIONS - Database-first, admin-verified operations
 * All operations verify admin status through secure database functions
 */
export const useSecureRBACOperations = (
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>
) => {
  const [loading, setLoading] = useState(false);

  // Secure admin verification
  const verifyAdminAccess = async (): Promise<boolean> => {
    try {
      const { data: isAdmin, error } = await supabase.rpc('current_user_is_admin');
      
      if (error || !isAdmin) {
        throw new Error('Admin privileges required');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Admin verification failed:', error);
      throw new Error('You do not have permission to perform this action');
    }
  };

  // Secure role operations
  const addRole = async (roleData: Partial<SystemGroup>): Promise<void> => {
    setLoading(true);
    try {
      await verifyAdminAccess();

      const { data: newRole, error } = await supabase.rpc('admin_create_role', {
        p_name: roleData.name,
        p_description: roleData.description || '',
        p_color: roleData.color || '#3b82f6',
        p_permissions: roleData.permissions || []
      });

      if (error) throw error;

      if (newRole && newRole.length > 0) {
        const roleWithPermissions: SystemGroup = {
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
      console.error('❌ Error adding role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: string, roleData: Partial<SystemGroup>): Promise<SystemGroup> => {
    setLoading(true);
    try {
      await verifyAdminAccess();

      const { data: success, error } = await supabase.rpc('admin_update_role', {
        p_role_id: id,
        p_name: roleData.name,
        p_description: roleData.description,
        p_color: roleData.color,
        p_permissions: roleData.permissions || []
      });

      if (error || !success) throw error || new Error('Failed to update role');

      // Fetch updated role data
      const { data: updatedRole, error: fetchError } = await supabase
        .from('user_groups')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const roleWithPermissions: SystemGroup = {
        id: updatedRole.id,
        name: updatedRole.name,
        description: updatedRole.description,
        color: updatedRole.color,
        role_id: updatedRole.role_id,
        permissions: roleData.permissions || [],
        isSystemRole: false
      };

      setRoles(prev => prev.map(role => 
        role.id === id ? roleWithPermissions : role
      ));

      return roleWithPermissions;
    } catch (error) {
      console.error('❌ Error updating role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await verifyAdminAccess();

      const { error } = await supabase
        .from('user_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRoles(prev => prev.filter(role => role.id !== id));
    } catch (error) {
      console.error('❌ Error deleting role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Secure user operations
  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    setLoading(true);
    try {
      // Verify user can update users via database
      const { data: canUpdate, error: permError } = await supabase.rpc('current_user_can_update_users');
      
      if (permError || !canUpdate) {
        throw new Error('You do not have permission to update users');
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role_id: userData.role_id,
          status: userData.status as UserStatus,
        })
        .eq('id', parseInt(id))
        .select()
        .single();

      if (error) throw error;

      // Transform database response to User type
      const updatedUser: User = {
        id: data.id.toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role_id: data.role_id,
        status: data.status as UserStatus,
        createdAt: data.created_at,
        licenseNumber: data.driver_license,
        totalTrips: data.total_trips,
        lastTrip: data.last_trip,
        profileImage: data.profile_image,
        badgeNumber: data.badge_number,
        dateOfBirth: data.date_of_birth,
        placeOfBirth: data.place_of_birth,
        address: data.address,
        driverLicense: data.driver_license
      };

      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // Verify user can delete users via database
      const { data: canDelete, error: permError } = await supabase.rpc('current_user_can_delete_users');
      
      if (permError || !canDelete) {
        throw new Error('You do not have permission to delete users');
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addRole,
    updateRole,
    deleteRole,
    updateUser,
    deleteUser,
  };
};

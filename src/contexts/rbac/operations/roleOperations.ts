
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SystemGroup } from '@/types/systemGroups';
import { verifyAdminAccess } from './adminOperations';

export const useRoleOperations = (
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>
) => {
  const [loading, setLoading] = useState(false);

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

  return {
    loading,
    addRole,
    updateRole,
    deleteRole,
  };
};

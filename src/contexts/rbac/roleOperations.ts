
import { supabase } from '@/integrations/supabase/client';
import type { Role } from '@/types/rbac';

export const createRoleOperations = (setRoles: React.Dispatch<React.SetStateAction<Role[]>>) => {
  const addRole = async (roleData: Partial<Role>) => {
    console.log('Adding role to database:', roleData);
    
    try {
      const { data, error } = await supabase
        .from('roles')
        .insert([{
          id: roleData.id,
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions || [],
          color: roleData.color,
          is_system_role: false,
        }])
        .select();

      if (error) {
        console.error('Supabase error adding role:', error);
        throw new Error(`Failed to add role: ${error.message}`);
      }

      if (data && data[0]) {
        const newRole: Role = {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description,
          permissions: data[0].permissions || [],
          color: data[0].color,
          isSystemRole: data[0].is_system_role || false,
        };
        
        console.log('Role created successfully:', newRole);
        setRoles(prev => [...prev, newRole]);
      }
    } catch (error) {
      console.error('Error in addRole operation:', error);
      throw error;
    }
  };

  const updateRole = async (id: string, roleData: Partial<Role>) => {
    console.log('Updating role in database:', id, roleData);
    
    try {
      const { data, error } = await supabase
        .from('roles')
        .update({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          color: roleData.color,
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase error updating role:', error);
        throw new Error(`Failed to update role: ${error.message}`);
      }

      if (data && data[0]) {
        const updatedRole: Role = {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description,
          permissions: data[0].permissions || [],
          color: data[0].color,
          isSystemRole: data[0].is_system_role || false,
        };
        
        console.log('Role updated successfully:', updatedRole);
        setRoles(prev => prev.map(role => role.id === id ? updatedRole : role));
      }
    } catch (error) {
      console.error('Error in updateRole operation:', error);
      throw error;
    }
  };

  const deleteRole = async (id: string) => {
    console.log('Deleting role from database:', id);
    
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting role:', error);
        throw new Error(`Failed to delete role: ${error.message}`);
      }

      console.log('Role deleted from database successfully:', id);
      setRoles(prev => prev.filter(role => role.id !== id));
    } catch (error) {
      console.error('Error in deleteRole operation:', error);
      throw error;
    }
  };

  return { addRole, updateRole, deleteRole };
};

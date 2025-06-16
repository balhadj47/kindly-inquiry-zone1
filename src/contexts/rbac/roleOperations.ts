
import type { Role } from '@/types/rbac';

export const createRoleOperations = (setRoles: React.Dispatch<React.SetStateAction<Role[]>>) => {
  const addRole = async (roleData: Partial<Role>) => {
    console.log('Adding role (client-side only):', roleData);
    
    try {
      // Since we don't have a roles table, we'll just add to local state
      const newRole: Role = {
        id: roleData.id || Math.random().toString(36).substr(2, 9),
        name: roleData.name || '',
        description: roleData.description || '',
        permissions: roleData.permissions || [],
        color: roleData.color || '#3b82f6',
        isSystemRole: false,
      };
      
      console.log('Role created successfully (client-side):', newRole);
      setRoles(prev => [...prev, newRole]);
    } catch (error) {
      console.error('Error in addRole operation:', error);
      throw error;
    }
  };

  const updateRole = async (id: string, roleData: Partial<Role>) => {
    console.log('Updating role (client-side only):', id, roleData);
    
    try {
      setRoles(prev => prev.map(role => 
        role.id === id ? { ...role, ...roleData } : role
      ));
      console.log('Role updated successfully (client-side)');
    } catch (error) {
      console.error('Error in updateRole operation:', error);
      throw error;
    }
  };

  const deleteRole = async (id: string) => {
    console.log('Deleting role (client-side only):', id);
    
    try {
      setRoles(prev => prev.filter(role => role.id !== id));
      console.log('Role deleted successfully (client-side)');
    } catch (error) {
      console.error('Error in deleteRole operation:', error);
      throw error;
    }
  };

  return { addRole, updateRole, deleteRole };
};

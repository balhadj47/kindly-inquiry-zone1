
import { SystemGroup } from '@/types/systemGroups';
import { SystemGroupsService } from '@/services/systemGroupsService';

export const createRoleOperations = (setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>) => {
  const addRole = async (roleData: Partial<SystemGroup>) => {
    console.log('Adding system group:', roleData);
    
    try {
      const newGroup = await SystemGroupsService.createSystemGroup(roleData);
      setRoles(prev => [...prev, newGroup]);
      console.log('✅ System group added successfully');
    } catch (error) {
      console.error('❌ Error in addRole operation:', error);
      throw error;
    }
  };

  const updateRole = async (id: string, roleData: Partial<SystemGroup>) => {
    console.log('Updating system group:', id, roleData);
    
    try {
      const updatedGroup = await SystemGroupsService.updateSystemGroup(id, roleData);
      setRoles(prev => prev.map(role => 
        role.id === id ? updatedGroup : role
      ));
      console.log('✅ System group updated successfully');
    } catch (error) {
      console.error('❌ Error in updateRole operation:', error);
      throw error;
    }
  };

  const deleteRole = async (id: string) => {
    console.log('Deleting system group:', id);
    
    try {
      await SystemGroupsService.deleteSystemGroup(id);
      setRoles(prev => prev.filter(role => role.id !== id));
      console.log('✅ System group deleted successfully');
    } catch (error) {
      console.error('❌ Error in deleteRole operation:', error);
      throw error;
    }
  };

  return { addRole, updateRole, deleteRole };
};

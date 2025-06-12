
import { supabase } from '@/integrations/supabase/client';
import type { Group } from '@/types/rbac';

export const createGroupOperations = (setGroups: React.Dispatch<React.SetStateAction<Group[]>>) => {
  // Helper function to get the next available role_id
  const getNextRoleId = async (): Promise<number> => {
    const { data, error } = await supabase
      .from('user_groups')
      .select('role_id')
      .order('role_id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error getting max role_id:', error);
      return 6; // Default fallback
    }

    const maxRoleId = data && data[0] ? data[0].role_id : 5;
    return (maxRoleId || 5) + 1;
  };

  const addGroup = async (groupData: Partial<Group>) => {
    console.log('Adding group to database:', groupData);
    
    try {
      // Generate a unique ID if not provided
      const groupId = groupData.id || crypto.randomUUID();
      const nextRoleId = await getNextRoleId();
      
      const { data, error } = await supabase
        .from('user_groups')
        .insert([{
          id: groupId,
          name: groupData.name,
          description: groupData.description,
          permissions: groupData.permissions || [],
          color: groupData.color,
          role_id: nextRoleId,
        }])
        .select();

      if (error) {
        console.error('Supabase error adding group:', error);
        throw new Error(`Failed to add group: ${error.message}`);
      }

      if (data && data[0]) {
        const newGroup: Group = {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description,
          permissions: data[0].permissions || [],
          color: data[0].color,
        };
        console.log('Group created successfully:', newGroup);
        setGroups(prev => [...prev, newGroup]);
        console.log('Group added to state successfully:', newGroup.id);
      } else {
        throw new Error('No data returned from group creation');
      }
    } catch (error) {
      console.error('Error in addGroup operation:', error);
      throw error;
    }
  };

  const updateGroup = async (id: string, groupData: Partial<Group>) => {
    console.log('Updating group in database:', id, groupData);
    
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .update({
          name: groupData.name,
          description: groupData.description,
          permissions: groupData.permissions,
          color: groupData.color,
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase error updating group:', error);
        throw new Error(`Failed to update group: ${error.message}`);
      }

      if (data && data[0]) {
        const updatedGroup: Group = {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description,
          permissions: data[0].permissions || [],
          color: data[0].color,
        };
        console.log('Group updated successfully:', updatedGroup);
        setGroups(prev => prev.map(group => group.id === id ? updatedGroup : group));
        console.log('Group updated in state successfully:', updatedGroup.id);
      } else {
        throw new Error('No data returned from group update');
      }
    } catch (error) {
      console.error('Error in updateGroup operation:', error);
      throw error;
    }
  };

  const deleteGroup = async (id: string) => {
    console.log('Deleting group from database:', id);
    
    try {
      // Check if this is a protected default group
      const defaultGroupIds = ['administrator', 'employee', 'supervisor', 'driver', 'security'];
      if (defaultGroupIds.includes(id)) {
        throw new Error('Cannot delete default system groups');
      }
      
      const { error } = await supabase
        .from('user_groups')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting group:', error);
        throw new Error(`Failed to delete group: ${error.message}`);
      }

      console.log('Group deleted from database successfully:', id);
      setGroups(prev => prev.filter(group => group.id !== id));
      console.log('Group removed from state successfully:', id);
    } catch (error) {
      console.error('Error in deleteGroup operation:', error);
      throw error;
    }
  };

  return { addGroup, updateGroup, deleteGroup };
};

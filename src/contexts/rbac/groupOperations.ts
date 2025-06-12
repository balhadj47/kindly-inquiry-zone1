
import { supabase } from '@/integrations/supabase/client';
import type { Group } from '@/types/rbac';

export const createGroupOperations = (setGroups: React.Dispatch<React.SetStateAction<Group[]>>) => {
  const addGroup = async (groupData: Partial<Group>) => {
    console.log('Adding group to database:', groupData);
    
    const { data, error } = await supabase
      .from('user_groups')
      .insert([{
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        permissions: groupData.permissions,
        color: groupData.color,
      }])
      .select();

    if (error) {
      console.error('Error adding group:', error);
      throw error;
    }

    if (data && data[0]) {
      const newGroup: Group = {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description,
        permissions: data[0].permissions || [],
        color: data[0].color,
      };
      setGroups(prev => [...prev, newGroup]);
      console.log('Group added successfully:', newGroup.id);
    }
  };

  const updateGroup = async (id: string, groupData: Partial<Group>) => {
    console.log('Updating group in database:', id, groupData);
    
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
      console.error('Error updating group:', error);
      throw error;
    }

    if (data && data[0]) {
      const updatedGroup: Group = {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description,
        permissions: data[0].permissions || [],
        color: data[0].color,
      };
      setGroups(prev => prev.map(group => group.id === id ? updatedGroup : group));
      console.log('Group updated successfully:', updatedGroup.id);
    }
  };

  const deleteGroup = async (id: string) => {
    console.log('Deleting group from database:', id);
    
    const { error } = await supabase
      .from('user_groups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting group:', error);
      throw error;
    }

    setGroups(prev => prev.filter(group => group.id !== id));
    console.log('Group deleted successfully:', id);
  };

  return { addGroup, updateGroup, deleteGroup };
};

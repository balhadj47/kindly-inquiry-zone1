
import { supabase } from '@/integrations/supabase/client';
import type { UserGroup } from '@/types/rbac';

export const createGroupOperations = (setGroups: React.Dispatch<React.SetStateAction<UserGroup[]>>) => {
  const addGroup = async (groupData: Partial<UserGroup>) => {
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
      const newGroup = {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description,
        permissions: data[0].permissions || [],
        color: data[0].color,
      };
      setGroups(prev => [...prev, newGroup]);
    }
  };

  const updateGroup = async (id: string, groupData: Partial<UserGroup>) => {
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
      const updatedGroup = {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description,
        permissions: data[0].permissions || [],
        color: data[0].color,
      };
      setGroups(prev => prev.map(group => group.id === id ? updatedGroup : group));
    }
  };

  const deleteGroup = async (id: string) => {
    const { error } = await supabase
      .from('user_groups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting group:', error);
      throw error;
    }

    setGroups(prev => prev.filter(group => group.id !== id));
  };

  return { addGroup, updateGroup, deleteGroup };
};

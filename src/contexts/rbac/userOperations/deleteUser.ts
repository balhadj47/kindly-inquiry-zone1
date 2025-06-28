
import { supabase } from '@/integrations/supabase/client';

export const createDeleteUserOperation = (setUsers: React.Dispatch<React.SetStateAction<any[]>>) => {
  const deleteUser = async (userId: string): Promise<void> => {
    console.log('Deleting user from database:', userId);
    
    try {
      // First check if current user has permission to delete users
      const { data: hasPermission, error: permError } = await supabase.rpc('current_user_can_delete_users');
      
      if (permError) {
        console.error('Error checking user deletion permission:', permError);
        throw new Error('Failed to verify permissions');
      }
      
      if (!hasPermission) {
        console.error('User does not have permission to delete users');
        throw new Error('You do not have permission to delete users');
      }
      
      console.log('User has permission to delete users, proceeding...');

      // Delete user from database
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', parseInt(userId));

      if (error) {
        console.error('Supabase error deleting user:', error);
        if (error.code === '42501' || error.message.includes('policy')) {
          throw new Error('You do not have permission to delete users');
        }
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));

      console.log('User deleted from database successfully:', userId);
    } catch (error) {
      console.error('Error in deleteUser operation:', error);
      throw error;
    }
  };

  return deleteUser;
};

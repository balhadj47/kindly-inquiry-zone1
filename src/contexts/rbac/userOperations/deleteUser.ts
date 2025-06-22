
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/rbac';

export const createDeleteUserOperation = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const deleteUser = async (id: string) => {
    console.log('Deleting user from database:', id);
    
    try {
      // Optimistic update - remove from UI immediately
      setUsers(prev => prev.filter(user => user.id !== id));

      // For employees (role_id: 3), skip auth operations for speed
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('auth_user_id, email, role_id')
        .eq('id', parseInt(id))
        .single();

      // Delete from users table
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', parseInt(id));

      if (error) {
        console.error('Supabase error deleting user:', error);
        // Revert optimistic update on error
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      // Only delete auth user if it's not an employee and has auth_user_id
      if (userData?.auth_user_id && userData.role_id !== 3) {
        console.log('Deleting auth user for non-employee:', id);
        try {
          const { error: authError } = await supabase.auth.admin.deleteUser(
            userData.auth_user_id
          );

          if (authError) {
            console.error('Error deleting auth user:', authError);
            console.warn('User deleted from database but auth user deletion failed. Manual cleanup may be required.');
          } else {
            console.log('Auth user deleted successfully');
          }
        } catch (authDeleteError) {
          console.error('Error in auth user deletion:', authDeleteError);
          console.warn('User deleted from database but auth user deletion failed. Manual cleanup may be required.');
        }
      }

      console.log('User deleted from database successfully:', id);
    } catch (error) {
      console.error('Error in deleteUser operation:', error);
      // Revert optimistic update by refetching or re-adding user
      // For now, we'll let the error bubble up and the UI will handle it
      throw error;
    }
  };

  return deleteUser;
};

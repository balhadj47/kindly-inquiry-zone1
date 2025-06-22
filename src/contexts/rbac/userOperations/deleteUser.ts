
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/rbac';

export const createDeleteUserOperation = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const deleteUser = async (id: string) => {
    console.log('Deleting user from database:', id);
    
    try {
      // First, get the user to check if they have an auth account
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('auth_user_id, email')
        .eq('id', parseInt(id))
        .single();

      if (fetchError) {
        console.error('Error fetching user for deletion:', fetchError);
        // Continue with deletion even if we can't fetch user data
      }

      // Delete from users table
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', parseInt(id));

      if (error) {
        console.error('Supabase error deleting user:', error);
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      // If user has an auth account, delete it too
      if (userData?.auth_user_id) {
        console.log('Deleting auth user for user:', id);
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
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error in deleteUser operation:', error);
      throw error;
    }
  };

  return deleteUser;
};

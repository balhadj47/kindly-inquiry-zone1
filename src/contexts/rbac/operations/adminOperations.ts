
import { supabase } from '@/integrations/supabase/client';

/**
 * Admin verification utilities
 */
export const verifyAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: isAdmin, error } = await supabase.rpc('current_user_is_admin');
    
    if (error || !isAdmin) {
      throw new Error('Admin privileges required');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Admin verification failed:', error);
    throw new Error('You do not have permission to perform this action');
  }
};

export const verifyUserUpdatePermission = async (): Promise<boolean> => {
  try {
    const { data: canUpdate, error } = await supabase.rpc('current_user_can_update_users');
    
    if (error || !canUpdate) {
      throw new Error('You do not have permission to update users');
    }
    
    return true;
  } catch (error) {
    console.error('❌ User update permission check failed:', error);
    throw new Error('You do not have permission to update users');
  }
};

export const verifyUserDeletePermission = async (): Promise<boolean> => {
  try {
    const { data: canDelete, error } = await supabase.rpc('current_user_can_delete_users');
    
    if (error || !canDelete) {
      throw new Error('You do not have permission to delete users');
    }
    
    return true;
  } catch (error) {
    console.error('❌ User delete permission check failed:', error);
    throw new Error('You do not have permission to delete users');
  }
};

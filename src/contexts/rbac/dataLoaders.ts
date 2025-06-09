
import { supabase } from '@/integrations/supabase/client';
import { RBACUser, RBACGroup } from './types';

export const loadUserData = async (): Promise<RBACUser | null> => {
  try {
    console.log('Loading user data from get_current_user_rbac function...');
    
    const { data, error } = await supabase
      .rpc('get_current_user_rbac');
    
    console.log('get_current_user_rbac result:', { data, error });
    
    if (error) {
      console.error('Error calling get_current_user_rbac:', error);
      throw error;
    }

    if (!data) {
      console.log('No user data returned from get_current_user_rbac');
      return null;
    }

    const userData: RBACUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      groupId: data.group_id,
      role: data.role,
      status: data.status,
      createdAt: data.created_at,
      licenseNumber: data.license_number,
      totalTrips: data.total_trips,
      lastTrip: data.last_trip,
    };

    console.log('Transformed user data:', userData);
    return userData;
  } catch (error) {
    console.error('Error in loadUserData:', error);
    throw error;
  }
};

export const loadGroupsData = async (): Promise<RBACGroup[]> => {
  try {
    console.log('Loading groups data...');
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('*');

    console.log('Groups query result:', { data, error });

    if (error) {
      console.error('Error loading groups:', error);
      throw error;
    }

    const groups: RBACGroup[] = (data || []).map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      color: group.color,
      permissions: group.permissions || [],
    }));

    console.log('Transformed groups data:', groups);
    return groups;
  } catch (error) {
    console.error('Error in loadGroupsData:', error);
    throw error;
  }
};

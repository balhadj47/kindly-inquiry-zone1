
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRoleData = (roleId: number) => {
  const [roleName, setRoleName] = useState<string>(`Role ${roleId}`);
  const [roleColor, setRoleColor] = useState<string>('#6b7280');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoleData = async () => {
      try {
        setLoading(true);
        console.log('🔍 useRoleData: Loading role data for role_id:', roleId);
        
        if (!roleId) {
          console.warn('⚠️ useRoleData: Invalid role_id provided:', roleId);
          setRoleName('Unknown Role');
          setRoleColor('#6b7280');
          setLoading(false);
          return;
        }

        // Direct database query instead of utility functions
        const { data, error } = await supabase
          .from('user_groups')
          .select('name, color')
          .eq('role_id', roleId)
          .single();

        if (error) {
          console.error('❌ useRoleData: Database error:', error);
          if (error.code === 'PGRST116') {
            setRoleName(`Role ${roleId} (Not Found)`);
          } else {
            setRoleName(`Role ${roleId}`);
          }
          setRoleColor('#6b7280');
        } else if (data) {
          console.log('✅ useRoleData: Successfully loaded role data:', data);
          setRoleName(data.name || `Role ${roleId}`);
          setRoleColor(data.color || '#6b7280');
        }
      } catch (error) {
        console.error('❌ useRoleData: Exception:', error);
        setRoleName(`Role ${roleId}`);
        setRoleColor('#6b7280');
      } finally {
        setLoading(false);
      }
    };

    loadRoleData();
  }, [roleId]);

  return { roleName, roleColor, loading };
};

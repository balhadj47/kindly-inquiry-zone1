
import { useState, useEffect } from 'react';
import { getRoleNameFromId, getRoleColorFromId } from '@/utils/roleUtils';

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

        const [name, color] = await Promise.all([
          getRoleNameFromId(roleId),
          getRoleColorFromId(roleId)
        ]);
        
        console.log('✅ useRoleData: Loaded role data:', { roleId, name, color });
        setRoleName(name);
        setRoleColor(color);
      } catch (error) {
        console.error('❌ useRoleData: Error loading role data:', error);
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

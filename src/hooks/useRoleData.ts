
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
        const [name, color] = await Promise.all([
          getRoleNameFromId(roleId),
          getRoleColorFromId(roleId)
        ]);
        setRoleName(name);
        setRoleColor(color);
      } catch (error) {
        console.error('Error loading role data:', error);
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

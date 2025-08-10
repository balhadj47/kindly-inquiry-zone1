
import { useMemo } from 'react';
import { User } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';

export const useNonEmployeeUsers = (users: User[]) => {
  const { roles } = useRBAC();

  return useMemo(() => {
    try {
      if (!users || !Array.isArray(users)) {
        return [];
      }
      
      const filtered = users.filter(user => {
        if (!user || typeof user !== 'object') {
          return false;
        }
        
        const roleId = user.role_id;
        if (roleId === null || roleId === undefined) {
          return true;
        }
        
        const userRole = roles.find(role => (role as any).role_id === roleId);
        if (!userRole) {
          return true;
        }
        
        const permissionCount = userRole.permissions ? userRole.permissions.length : 0;
        const isHighPrivilegeUser = permissionCount >= 5;
        
        return isHighPrivilegeUser;
      });
      
      return filtered;
    } catch (error) {
      return [];
    }
  }, [users, roles]);
};

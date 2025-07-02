
import { useRBAC } from '@/contexts/RBACContext';

export const useRoleData = (roleId?: number) => {
  const { roles } = useRBAC();

  const getRoleById = (id: number) => {
    return roles?.find(role => (role as any).role_id === id);
  };

  const currentRole = roleId ? getRoleById(roleId) : null;
  const roleName = currentRole?.name || 'Employé';

  return {
    roles: roles || [],
    roleName,
    currentRole,
    getRoleById,
  };
};

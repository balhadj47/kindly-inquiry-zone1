
import { useRoleOperations } from './operations/roleOperations';
import { useUserOperations } from './operations/userOperations';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

/**
 * SECURE RBAC OPERATIONS - Database-first, admin-verified operations
 * All operations verify admin status through secure database functions
 */
export const useSecureRBACOperations = (
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>
) => {
  const roleOps = useRoleOperations(setRoles);
  const userOps = useUserOperations(setUsers);

  return {
    loading: roleOps.loading || userOps.loading,
    addRole: roleOps.addRole,
    updateRole: roleOps.updateRole,
    deleteRole: roleOps.deleteRole,
    updateUser: userOps.updateUser,
    deleteUser: userOps.deleteUser,
  };
};

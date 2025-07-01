
import { usePermissions } from '@/hooks/usePermissions';

export const useEmployeePermissions = () => {
  const permissions = usePermissions();

  console.log('🔐 Employees: Permissions:', {
    canCreateUsers: permissions.canCreateUsers,
    canUpdateUsers: permissions.canUpdateUsers,
    canDeleteUsers: permissions.canDeleteUsers,
    canReadUsers: permissions.canReadUsers,
    isHighPrivilegeUser: permissions.isHighPrivilegeUser
  });

  return {
    canCreateUsers: permissions.canCreateUsers,
    canEditUsers: permissions.canUpdateUsers,
    canDeleteUsers: permissions.canDeleteUsers,
    hasUsersReadPermission: permissions.canReadUsers,
  };
};

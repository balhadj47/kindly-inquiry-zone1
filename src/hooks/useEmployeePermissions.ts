
import { useSecurePermissions } from './useSecurePermissions';

export const useEmployeePermissions = () => {
  const permissions = useSecurePermissions();

  console.log('🔐 Employees: Secure Permissions:', {
    canCreateUsers: permissions.canCreateUsers,
    canUpdateUsers: permissions.canUpdateUsers,
    canDeleteUsers: permissions.canDeleteUsers,
    canReadUsers: permissions.canReadUsers,
    isAdmin: permissions.isAdmin
  });

  return {
    canCreateUsers: permissions.canCreateUsers,
    canEditUsers: permissions.canUpdateUsers,
    canDeleteUsers: permissions.canDeleteUsers,
    hasUsersReadPermission: permissions.canReadUsers,
  };
};

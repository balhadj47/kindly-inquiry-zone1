
import { useSecurePermissions } from './useSecurePermissions';

export const useEmployeePermissions = () => {
  const permissions = useSecurePermissions();

  return {
    canCreateUsers: permissions.canCreateUsers,
    canEditUsers: permissions.canUpdateUsers,
    canDeleteUsers: permissions.canDeleteUsers,
    hasUsersReadPermission: permissions.canReadUsers,
    // Add missing properties for backward compatibility
    canUpdateUsers: permissions.canUpdateUsers,
  };
};

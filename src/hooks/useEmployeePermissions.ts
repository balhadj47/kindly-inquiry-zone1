
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';

export const useEmployeePermissions = () => {
  const { user: authUser } = useAuth();
  const { currentUser, hasPermission } = useRBAC();

  // Check permissions using RBAC context instead of auth user
  console.log('🔐 Employees: Current user from RBAC:', currentUser?.role_id);
  console.log('🔐 Employees: Auth user email:', authUser?.email);
  
  // Special handling for known admin user
  const isKnownAdmin = authUser?.email === 'gb47@msn.com';
  
  // Use RBAC permissions system
  const canCreateUsers = hasPermission('users:create') || !!authUser; // All authenticated users can add employees
  const canEditUsers = hasPermission('users:update') || isKnownAdmin;
  const canDeleteUsers = hasPermission('users:delete') || isKnownAdmin;
  const hasUsersReadPermission = hasPermission('users:read') || isKnownAdmin;
  
  console.log('🔐 Employees: Permissions - Create:', canCreateUsers, 'Edit:', canEditUsers, 'Delete:', canDeleteUsers);
  console.log('🔐 Employees: Is known admin:', isKnownAdmin);

  return {
    authUser,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    hasUsersReadPermission,
  };
};


import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';

export const useEmployeePermissions = () => {
  const { user: authUser } = useAuth();
  const { currentUser, hasPermission, roles } = useRBAC();

  // Check permissions using RBAC context dynamically
  console.log('🔐 Employees: Current user from RBAC:', currentUser?.role_id);
  console.log('🔐 Employees: Auth user email:', authUser?.email);
  
  // Dynamic admin detection based on role permissions
  const isHighPrivilegeUser = () => {
    if (!currentUser?.role_id || !roles) return false;
    
    const userRole = roles.find(role => (role as any).role_id === currentUser.role_id);
    if (!userRole) return false;
    
    // High privilege users have many permissions (10+)
    return userRole.permissions.length >= 10;
  };
  
  // Use RBAC permissions system
  const canCreateUsers = hasPermission('users:create') || !!authUser; // All authenticated users can add employees
  const canEditUsers = hasPermission('users:update') || isHighPrivilegeUser();
  const canDeleteUsers = hasPermission('users:delete') || isHighPrivilegeUser();
  const hasUsersReadPermission = hasPermission('users:read') || isHighPrivilegeUser();
  
  console.log('🔐 Employees: Permissions - Create:', canCreateUsers, 'Edit:', canEditUsers, 'Delete:', canDeleteUsers);
  console.log('🔐 Employees: Is high privilege user:', isHighPrivilegeUser());

  return {
    authUser,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    hasUsersReadPermission,
  };
};

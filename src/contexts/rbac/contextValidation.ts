
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

// Safe context value extraction with validation
export const extractContextValues = (context: any) => {
  let currentUser: User | null = null;
  let users: User[] = [];
  let roles: SystemGroup[] = [];
  let permissions: string[] = [];
  let loading = true;
  
  try {
    currentUser = context.currentUser || null;
    users = Array.isArray(context.users) ? context.users : [];
    roles = Array.isArray(context.roles) ? context.roles : [];
    permissions = Array.isArray(context.permissions) ? context.permissions : [];
    loading = typeof context.loading === 'boolean' ? context.loading : true;
    
    console.log('🔐 contextValidation: Context values extracted:', {
      currentUserId: currentUser?.id || 'null',
      currentUserRoleId: currentUser?.role_id || 'null',
      usersCount: users.length,
      rolesCount: roles.length,
      permissionsCount: permissions.length,
      loading: loading
    });
  } catch (error) {
    console.error('❌ contextValidation: Error extracting context values:', error);
    
    // Fallback values
    currentUser = null;
    users = [];
    roles = [];
    permissions = [];
    loading = true;
  }
  
  return {
    currentUser,
    users,
    roles,
    permissions,
    loading
  };
};

// Create safe fallback context when context is not available
export const createFallbackContext = () => {
  console.error('❌ useRBAC: Context not available, returning safe fallback');
  
  return {
    currentUser: null,
    users: [],
    roles: [],
    permissions: [],
    loading: true,
    hasPermission: (permission: string) => {
      console.warn('🚫 useRBAC: hasPermission called outside RBACProvider context:', permission);
      return false;
    },
    getUserRole: () => {
      console.warn('🚫 useRBAC: getUserRole called outside RBACProvider context');
      return null;
    },
    canUserPerformAction: () => {
      console.warn('🚫 useRBAC: canUserPerformAction called outside RBACProvider context');
      return false;
    },
    addUser: async () => {
      console.warn('🚫 useRBAC: addUser called outside RBACProvider context');
      return { success: false, error: 'Context not available' };
    },
    updateUser: async () => {
      console.warn('🚫 useRBAC: updateUser called outside RBACProvider context');
      return { success: false, error: 'Context not available' };
    },
    deleteUser: async () => {
      console.warn('🚫 useRBAC: deleteUser called outside RBACProvider context');
      return { success: false, error: 'Context not available' };
    },
    changeUserPassword: async () => {
      console.warn('🚫 useRBAC: changeUserPassword called outside RBACProvider context');
      return { success: false, error: 'Context not available' };
    },
    addRole: async () => {
      console.warn('🚫 useRBAC: addRole called outside RBACProvider context');
      return { success: false, error: 'Context not available' };
    },
    updateRole: async () => {
      console.warn('🚫 useRBAC: updateRole called outside RBACProvider context');
      return { success: false, error: 'Context not available' };
    },
    deleteRole: async () => {
      console.warn('🚫 useRBAC: deleteRole called outside RBACProvider context');
      return { success: false, error: 'Context not available' };
    },
    setUser: () => {
      console.warn('🚫 useRBAC: setUser called outside RBACProvider context');
    },
  };
};

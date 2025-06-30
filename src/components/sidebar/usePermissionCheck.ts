
export const usePermissionCheck = (hasPermission: (permission: string) => boolean) => {
  const checkItemPermission = (permission?: string): boolean => {
    if (!permission) {
      console.log('⚠️ Menu item has no permission requirement - skipping');
      return false;
    }
    
    if (typeof hasPermission !== 'function') {
      console.error('⚠️ hasPermission is not a function:', typeof hasPermission);
      return false;
    }
    
    return hasPermission(permission);
  };

  return { checkItemPermission };
};

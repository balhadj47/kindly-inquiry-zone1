
export const usePermissionCheck = (hasPermission: (permission: string) => boolean) => {
  const checkItemPermission = (permission?: string): boolean => {
    if (!permission) {
      return false;
    }
    
    if (typeof hasPermission !== 'function') {
      return false;
    }
    
    return hasPermission(permission);
  };

  return { checkItemPermission };
};

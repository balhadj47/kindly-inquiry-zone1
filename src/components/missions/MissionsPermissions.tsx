
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';

interface MissionsPermissions {
  canRead: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const useMissionsPermissions = () => {
  const [permissions, setPermissions] = useState<MissionsPermissions>({
    canRead: false,
    canCreate: false,
    canEdit: false,
    canDelete: false
  });

  const { user: authUser } = useAuth();
  const { hasPermission, roles, currentUser } = useRBAC();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Dynamic privilege detection
        const isHighPrivilegeUser = () => {
          if (!currentUser?.role_id || !roles) return false;
          
          const userRole = roles.find(role => (role as any).role_id === currentUser.role_id);
          if (!userRole) return false;
          
          // High privilege users have many permissions (10+)
          return userRole.permissions.length >= 10;
        };

        if (isHighPrivilegeUser()) {
          setPermissions({
            canRead: true,
            canCreate: true,
            canEdit: true,
            canDelete: true
          });
          return;
        }

        if (!hasPermission || typeof hasPermission !== 'function') {
          console.warn('hasPermission is not available');
          return;
        }

        const canRead = hasPermission('trips:read');
        const canCreate = hasPermission('trips:create');
        const canEdit = hasPermission('trips:update');
        const canDelete = hasPermission('trips:delete');

        setPermissions({ canRead, canCreate, canEdit, canDelete });
      } catch (permissionError) {
        console.error('Error checking permissions:', permissionError);
        // Set minimal permissions on error
        setPermissions({
          canRead: true,
          canCreate: false,
          canEdit: false,
          canDelete: false
        });
      }
    };

    if (authUser) {
      checkPermissions();
    }
  }, [authUser, hasPermission, currentUser, roles]);

  return permissions;
};

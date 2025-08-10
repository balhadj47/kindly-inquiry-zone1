
import { useCallback } from 'react';
import { User } from '@/types/rbac';

interface UseSafeUserHandlersProps {
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onChangePassword: (user: User) => void;
}

export const useSafeUserHandlers = ({
  onEditUser,
  onDeleteUser,
  onChangePassword,
}: UseSafeUserHandlersProps) => {
  const safeOnEditUser = useCallback((user: User) => {
    try {
      if (!user || typeof user !== 'object' || !user.id) {
        return;
      }
      onEditUser(user);
    } catch (error) {
      // Handle error silently
    }
  }, [onEditUser]);

  const safeOnDeleteUser = useCallback((user: User) => {
    try {
      if (!user || typeof user !== 'object' || !user.id) {
        return;
      }
      onDeleteUser(user);
    } catch (error) {
      // Handle error silently
    }
  }, [onDeleteUser]);

  const safeOnChangePassword = useCallback((user: User) => {
    try {
      if (!user || typeof user !== 'object' || !user.id) {
        return;
      }
      onChangePassword(user);
    } catch (error) {
      // Handle error silently
    }
  }, [onChangePassword]);

  return {
    safeOnEditUser,
    safeOnDeleteUser,
    safeOnChangePassword,
  };
};

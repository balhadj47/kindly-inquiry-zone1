
import { useState, useCallback } from 'react';
import { User } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';

export const useUserActionHandlers = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const { users, deleteUser, currentUser } = useRBAC();

  const handleAddUser = useCallback(() => {
    try {
      console.log('UserActionHandlers - Adding new user');
      setSelectedUser(null);
      setIsUserModalOpen(true);
    } catch (error) {
      console.error('Error handling add user:', error);
    }
  }, []);

  const handleEditUser = useCallback((user: User) => {
    try {
      if (!user || !user.id) {
        console.error('UserActionHandlers - Invalid user data for edit:', user);
        return;
      }
      console.log('UserActionHandlers - Editing user:', user.id);
      setSelectedUser(user);
      setIsUserModalOpen(true);
    } catch (error) {
      console.error('Error handling edit user:', error);
    }
  }, []);

  const handleChangePassword = useCallback((user: User) => {
    try {
      if (!user || !user.id) {
        console.error('UserActionHandlers - Invalid user data for password change:', user);
        return;
      }
      console.log('UserActionHandlers - Changing password for user:', user.id);
      setSelectedUser(user);
      setIsPasswordModalOpen(true);
    } catch (error) {
      console.error('Error handling change password:', error);
    }
  }, []);

  const handleDeleteUser = useCallback(async (user: User) => {
    try {
      if (!user || !user.id) {
        console.error('UserActionHandlers - Invalid user data for delete:', user);
        return;
      }

      if (currentUser && currentUser.id === user.id) {
        console.warn('UserActionHandlers - Attempting to delete own account');
        alert("Vous ne pouvez pas supprimer votre propre compte.");
        return;
      }

      if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`)) {
        console.log('UserActionHandlers - Deleting user:', user.id);
        await deleteUser(user.id);
        console.log('UserActionHandlers - User deleted successfully');
      }
    } catch (error) {
      console.error('UserActionHandlers - Error deleting user:', error);
      alert("Erreur lors de la suppression de l'utilisateur. Veuillez réessayer.");
    }
  }, [deleteUser, currentUser]);

  return {
    // Modal states
    isUserModalOpen,
    setIsUserModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    selectedUser,
    // Handlers
    handleAddUser,
    handleEditUser,
    handleChangePassword,
    handleDeleteUser,
  };
};

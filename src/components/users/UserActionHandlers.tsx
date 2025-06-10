
import { useState, useCallback } from 'react';
import { User, UserGroup } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';

export const useUserActionHandlers = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  
  const { users, deleteGroup, deleteUser, currentUser } = useRBAC();

  // Safe modal state setters
  const safeSetUserModal = useCallback((isOpen: boolean) => {
    try {
      setIsUserModalOpen(isOpen);
    } catch (error) {
      console.error('Error setting user modal state:', error);
    }
  }, []);

  const safeSetGroupModal = useCallback((isOpen: boolean) => {
    try {
      setIsGroupModalOpen(isOpen);
    } catch (error) {
      console.error('Error setting group modal state:', error);
    }
  }, []);

  const safeSetPermissionsModal = useCallback((isOpen: boolean) => {
    try {
      setIsPermissionsModalOpen(isOpen);
    } catch (error) {
      console.error('Error setting permissions modal state:', error);
    }
  }, []);

  const safeSetPasswordModal = useCallback((isOpen: boolean) => {
    try {
      setIsPasswordModalOpen(isOpen);
    } catch (error) {
      console.error('Error setting password modal state:', error);
    }
  }, []);

  const handleAddUser = useCallback(() => {
    try {
      console.log('UserActionHandlers - Adding new user');
      setSelectedUser(null);
      safeSetUserModal(true);
    } catch (error) {
      console.error('Error handling add user:', error);
    }
  }, [safeSetUserModal]);

  const handleEditUser = useCallback((user: User) => {
    try {
      if (!user || !user.id) {
        console.error('UserActionHandlers - Invalid user data for edit:', user);
        return;
      }
      console.log('UserActionHandlers - Editing user:', user.id);
      setSelectedUser(user);
      safeSetUserModal(true);
    } catch (error) {
      console.error('Error handling edit user:', error);
    }
  }, [safeSetUserModal]);

  const handleChangePassword = useCallback((user: User) => {
    try {
      if (!user || !user.id) {
        console.error('UserActionHandlers - Invalid user data for password change:', user);
        return;
      }
      console.log('UserActionHandlers - Changing password for user:', user.id);
      setSelectedUser(user);
      safeSetPasswordModal(true);
    } catch (error) {
      console.error('Error handling change password:', error);
    }
  }, [safeSetPasswordModal]);

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

      console.log('UserActionHandlers - Deleting user:', user.id);
      await deleteUser(user.id);
      console.log('UserActionHandlers - User deleted successfully');
    } catch (error) {
      console.error('UserActionHandlers - Error deleting user:', error);
      alert("Erreur lors de la suppression de l'utilisateur. Veuillez réessayer.");
    }
  }, [deleteUser, currentUser]);

  const handleAddGroup = useCallback(() => {
    try {
      console.log('UserActionHandlers - Adding new group');
      setSelectedGroup(null);
      safeSetGroupModal(true);
    } catch (error) {
      console.error('Error handling add group:', error);
    }
  }, [safeSetGroupModal]);

  const handleEditGroup = useCallback((group: UserGroup) => {
    try {
      if (!group || !group.id) {
        console.error('UserActionHandlers - Invalid group data for edit:', group);
        return;
      }
      console.log('UserActionHandlers - Editing group:', group.id);
      setSelectedGroup(group);
      safeSetGroupModal(true);
    } catch (error) {
      console.error('Error handling edit group:', error);
    }
  }, [safeSetGroupModal]);

  const handleManagePermissions = useCallback((group: UserGroup) => {
    try {
      if (!group || !group.id) {
        console.error('UserActionHandlers - Invalid group data for permissions:', group);
        return;
      }
      console.log('UserActionHandlers - Managing permissions for group:', group.id);
      setSelectedGroup(group);
      safeSetPermissionsModal(true);
    } catch (error) {
      console.error('Error handling manage permissions:', error);
    }
  }, [safeSetPermissionsModal]);

  const handleDeleteGroup = useCallback(async (group: UserGroup) => {
    try {
      if (!group || !group.id) {
        console.error('UserActionHandlers - Invalid group data for delete:', group);
        return;
      }

      const safeUsers = Array.isArray(users) ? users : [];
      const usersInGroup = safeUsers.filter(user => user && user.groupId === group.id);
      
      if (usersInGroup.length > 0) {
        console.warn('UserActionHandlers - Cannot delete group with users:', group.id, usersInGroup.length);
        alert(`Impossible de supprimer le groupe "${group.name}" car ${usersInGroup.length} utilisateur(s) y sont assignés. Veuillez d'abord réassigner ces utilisateurs à un autre groupe.`);
        return;
      }

      const defaultGroupIds = ['admin', 'employee'];
      if (defaultGroupIds.includes(group.id)) {
        console.warn('UserActionHandlers - Cannot delete default group:', group.id);
        alert(`Impossible de supprimer le groupe par défaut "${group.name}".`);
        return;
      }

      console.log('UserActionHandlers - Deleting group:', group.id);
      await deleteGroup(group.id);
      console.log('UserActionHandlers - Group deleted successfully');
    } catch (error) {
      console.error('UserActionHandlers - Error deleting group:', error);
      alert("Erreur lors de la suppression du groupe. Veuillez réessayer.");
    }
  }, [deleteGroup, users]);

  return {
    // Modal states
    isUserModalOpen,
    setIsUserModalOpen: safeSetUserModal,
    isGroupModalOpen,
    setIsGroupModalOpen: safeSetGroupModal,
    isPermissionsModalOpen,
    setIsPermissionsModalOpen: safeSetPermissionsModal,
    isPasswordModalOpen,
    setIsPasswordModalOpen: safeSetPasswordModal,
    selectedUser,
    selectedGroup,
    // Handlers
    handleAddUser,
    handleEditUser,
    handleChangePassword,
    handleDeleteUser,
    handleAddGroup,
    handleEditGroup,
    handleManagePermissions,
    handleDeleteGroup,
  };
};

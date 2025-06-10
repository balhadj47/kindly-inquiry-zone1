
import { useState } from 'react';
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

  const handleAddUser = () => {
    console.log('UserActionHandlers - Adding new user');
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    if (!user || !user.id) {
      console.error('UserActionHandlers - Invalid user data for edit:', user);
      return;
    }
    console.log('UserActionHandlers - Editing user:', user.id);
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleChangePassword = (user: User) => {
    if (!user || !user.id) {
      console.error('UserActionHandlers - Invalid user data for password change:', user);
      return;
    }
    console.log('UserActionHandlers - Changing password for user:', user.id);
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!user || !user.id) {
      console.error('UserActionHandlers - Invalid user data for delete:', user);
      return;
    }

    if (currentUser && currentUser.id === user.id) {
      console.warn('UserActionHandlers - Attempting to delete own account');
      alert("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }

    try {
      console.log('UserActionHandlers - Deleting user:', user.id);
      await deleteUser(user.id);
      console.log('UserActionHandlers - User deleted successfully');
    } catch (error) {
      console.error('UserActionHandlers - Error deleting user:', error);
      alert("Erreur lors de la suppression de l'utilisateur. Veuillez réessayer.");
    }
  };

  const handleAddGroup = () => {
    console.log('UserActionHandlers - Adding new group');
    setSelectedGroup(null);
    setIsGroupModalOpen(true);
  };

  const handleEditGroup = (group: UserGroup) => {
    if (!group || !group.id) {
      console.error('UserActionHandlers - Invalid group data for edit:', group);
      return;
    }
    console.log('UserActionHandlers - Editing group:', group.id);
    setSelectedGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleManagePermissions = (group: UserGroup) => {
    if (!group || !group.id) {
      console.error('UserActionHandlers - Invalid group data for permissions:', group);
      return;
    }
    console.log('UserActionHandlers - Managing permissions for group:', group.id);
    setSelectedGroup(group);
    setIsPermissionsModalOpen(true);
  };

  const handleDeleteGroup = async (group: UserGroup) => {
    if (!group || !group.id) {
      console.error('UserActionHandlers - Invalid group data for delete:', group);
      return;
    }

    const usersInGroup = users ? users.filter(user => user.groupId === group.id) : [];
    
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

    try {
      console.log('UserActionHandlers - Deleting group:', group.id);
      await deleteGroup(group.id);
      console.log('UserActionHandlers - Group deleted successfully');
    } catch (error) {
      console.error('UserActionHandlers - Error deleting group:', error);
      alert("Erreur lors de la suppression du groupe. Veuillez réessayer.");
    }
  };

  return {
    // Modal states
    isUserModalOpen,
    setIsUserModalOpen,
    isGroupModalOpen,
    setIsGroupModalOpen,
    isPermissionsModalOpen,
    setIsPermissionsModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
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

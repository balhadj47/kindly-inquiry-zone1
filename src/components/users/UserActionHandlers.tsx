
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
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (currentUser && currentUser.id === user.id) {
      alert("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }

    // Remove the duplicate confirmation - UserCard already has AlertDialog confirmation
    await deleteUser(user.id); // Now using string ID
  };

  const handleAddGroup = () => {
    setSelectedGroup(null);
    setIsGroupModalOpen(true);
  };

  const handleEditGroup = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleManagePermissions = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsPermissionsModalOpen(true);
  };

  const handleDeleteGroup = async (group: UserGroup) => {
    const usersInGroup = users.filter(user => user.groupId === group.id);
    
    if (usersInGroup.length > 0) {
      alert(`Impossible de supprimer le groupe "${group.name}" car ${usersInGroup.length} utilisateur(s) y sont assignés. Veuillez d'abord réassigner ces utilisateurs à un autre groupe.`);
      return;
    }

    const defaultGroupIds = ['admin', 'employee'];
    if (defaultGroupIds.includes(group.id)) {
      alert(`Impossible de supprimer le groupe par défaut "${group.name}".`);
      return;
    }

    await deleteGroup(group.id);
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


import React from 'react';
import { User, Group } from '@/types/rbac';
import UserModal from '../UserModal';
import GroupModal from '../GroupModal';
import GroupPermissionsModal from '../GroupPermissionsModal';
import PasswordChangeModal from '../PasswordChangeModal';

interface UsersModalsProps {
  isUserModalOpen: boolean;
  setIsUserModalOpen: (open: boolean) => void;
  isGroupModalOpen: boolean;
  setIsGroupModalOpen: (open: boolean) => void;
  isPermissionsModalOpen: boolean;
  setIsPermissionsModalOpen: (open: boolean) => void;
  isPasswordModalOpen: boolean;
  setIsPasswordModalOpen: (open: boolean) => void;
  selectedUser: User | null;
  selectedGroup: Group | null;
}

const UsersModals: React.FC<UsersModalsProps> = ({
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
}) => {
  return (
    <>
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        group={selectedGroup}
      />

      <GroupPermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        group={selectedGroup}
      />

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        user={selectedUser}
      />
    </>
  );
};

export default UsersModals;

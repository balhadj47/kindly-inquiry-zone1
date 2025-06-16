
import React from 'react';
import { User } from '@/types/rbac';
import UserModal from '../UserModal';
import PasswordChangeModal from '../PasswordChangeModal';

interface UsersModalsProps {
  isUserModalOpen: boolean;
  setIsUserModalOpen: (open: boolean) => void;
  isPasswordModalOpen: boolean;
  setIsPasswordModalOpen: (open: boolean) => void;
  selectedUser: User | null;
}

const UsersModals: React.FC<UsersModalsProps> = ({
  isUserModalOpen,
  setIsUserModalOpen,
  isPasswordModalOpen,
  setIsPasswordModalOpen,
  selectedUser,
}) => {
  return (
    <>
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
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

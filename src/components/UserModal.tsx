
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from '@/types/rbac';
import UserModalForm from './user-modal/UserModalForm';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}
          </DialogTitle>
          <DialogDescription>
            {user 
              ? 'Modifiez les informations de l\'utilisateur ci-dessous.' 
              : 'Remplissez les informations pour créer un nouvel utilisateur.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <UserModalForm
          user={user}
          isOpen={isOpen}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';
import UserModalForm from './user-modal/UserModalForm';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addUser, updateUser } = useRBAC();

  const handleSubmit = async (userData: Partial<User>) => {
    setIsSubmitting(true);
    try {
      if (user) {
        await updateUser(user.id, userData);
        console.log('User updated successfully');
      } else {
        await addUser(userData);
        console.log('User created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Error submitting user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;

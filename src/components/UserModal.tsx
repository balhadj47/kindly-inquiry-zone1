
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';
import { useToast } from '@/hooks/use-toast';
import UserModalForm from './user-modal/UserModalForm';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addUser, updateUser } = useRBAC();
  const { toast } = useToast();

  const handleSubmit = async (userData: Partial<User>) => {
    setIsSubmitting(true);
    try {
      if (user) {
        await updateUser(user.id, userData);
        console.log('User updated successfully');
        toast({
          title: 'Succès',
          description: 'Utilisateur modifié avec succès',
        });
      } else {
        await addUser(userData);
        console.log('User created successfully');
        toast({
          title: 'Succès',
          description: 'Utilisateur créé avec succès',
        });
      }
      onClose(); // This should close the modal after successful operation
    } catch (error) {
      console.error('Error submitting user:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
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

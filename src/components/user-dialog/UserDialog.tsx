
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';
import { useToast } from '@/hooks/use-toast';
import UserDialogForm from './UserDialogForm';

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  userType?: 'admin' | 'employee' | 'driver';
  onRefresh?: () => void;
}

const UserDialog: React.FC<UserDialogProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  userType = 'admin',
  onRefresh 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addUser, updateUser } = useRBAC();
  const { toast } = useToast();

  const getDialogConfig = () => {
    switch (userType) {
      case 'employee':
        return {
          title: user ? 'Modifier l\'Employé' : 'Ajouter un Nouvel Employé',
          description: user 
            ? 'Modifiez les informations de l\'employé ci-dessous.' 
            : 'Remplissez les informations pour créer un nouvel employé.',
          defaultRoleId: 3,
          showEmployeeFields: true,
          showDriverFields: false,
          requireEmail: false
        };
      case 'driver':
        return {
          title: user ? 'Modifier le Chauffeur' : 'Ajouter un Nouveau Chauffeur',
          description: user 
            ? 'Modifiez les informations du chauffeur ci-dessous.' 
            : 'Remplissez les informations pour créer un nouveau chauffeur.',
          defaultRoleId: 4,
          showEmployeeFields: false,
          showDriverFields: true,
          requireEmail: false
        };
      default:
        return {
          title: user ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur',
          description: user 
            ? 'Modifiez les informations de l\'utilisateur ci-dessous.' 
            : 'Remplissez les informations pour créer un nouvel utilisateur.',
          defaultRoleId: 2,
          showEmployeeFields: false,
          showDriverFields: false,
          requireEmail: true
        };
    }
  };

  const config = getDialogConfig();

  const handleSubmit = async (userData: Partial<User>) => {
    setIsSubmitting(true);
    try {
      console.log('UserDialog - Submitting user data:', userData);
      
      // Set default role based on user type if not editing
      const finalUserData = user ? userData : { 
        ...userData, 
        role_id: userData.role_id || config.defaultRoleId
      };
      
      console.log('UserDialog - Final user data:', finalUserData);
      
      if (user) {
        await updateUser(user.id, finalUserData);
        toast({
          title: 'Succès',
          description: `${userType === 'employee' ? 'Employé' : userType === 'driver' ? 'Chauffeur' : 'Utilisateur'} modifié avec succès`,
        });
      } else {
        await addUser(finalUserData);
        toast({
          title: 'Succès',
          description: `${userType === 'employee' ? 'Employé' : userType === 'driver' ? 'Chauffeur' : 'Utilisateur'} créé avec succès`,
        });
      }
      
      if (onRefresh) {
        onRefresh();
      }
      
      onClose();
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
      <DialogContent className="w-[95vw] max-w-[1000px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 lg:p-8">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground text-center sm:text-left">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <UserDialogForm
            user={user}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onClose}
            config={config}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;

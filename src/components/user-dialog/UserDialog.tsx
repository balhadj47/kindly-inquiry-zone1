
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, FileText, IdCard, Briefcase, Heart, Camera } from 'lucide-react';
import { User as UserType } from '@/types/rbac';
import UserDialogForm from './UserDialogForm';
import EmployeeNotesTab from './EmployeeNotesTab';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';
import { useRBAC } from '@/contexts/RBACContext';
import { useToast } from '@/hooks/use-toast';

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserType | null;
  userType?: 'employee' | 'driver' | 'user';
  onRefresh?: () => void;
}

const UserDialog: React.FC<UserDialogProps> = ({
  isOpen,
  onClose,
  user,
  userType = 'user',
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const permissions = useEmployeePermissions();
  const { updateUser, addUser } = useRBAC();
  const { toast } = useToast();

  const handleSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
    onClose();
  };

  const handleSubmit = async (userData: Partial<UserType>) => {
    setIsSubmitting(true);
    try {
      if (user) {
        await updateUser(user.id.toString(), userData);
        toast({
          title: 'Succès',
          description: 'Utilisateur modifié avec succès',
        });
      } else {
        await addUser(userData);
        toast({
          title: 'Succès',
          description: 'Utilisateur créé avec succès',
        });
      }
      handleSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder l\'utilisateur',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const getDialogTitle = () => {
    if (user) {
      return `Modifier ${userType === 'employee' ? 'l\'employé' : userType === 'driver' ? 'le chauffeur' : 'l\'utilisateur'}`;
    }
    return `Ajouter ${userType === 'employee' ? 'un employé' : userType === 'driver' ? 'un chauffeur' : 'un utilisateur'}`;
  };

  const getConfig = () => {
    const baseConfig = {
      title: getDialogTitle(),
      description: user ? 'Modifier les informations' : 'Créer un nouvel utilisateur',
      defaultRoleId: userType === 'employee' ? 2 : userType === 'driver' ? 3 : 4, // Default role IDs
      requireEmail: true,
    };

    return {
      ...baseConfig,
      showEmployeeFields: userType === 'employee',
      showDriverFields: userType === 'driver',
    };
  };

  const showNotesTab = user && userType === 'employee' && permissions.hasUsersReadPermission;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {getDialogTitle()}
            {user && (
              <span className="text-muted-foreground font-normal">
                - {user.name}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Informations</span>
              </TabsTrigger>
              <TabsTrigger value="identity" className="flex items-center gap-2">
                <IdCard className="h-4 w-4" />
                <span className="hidden sm:inline">Identité</span>
              </TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Professionnel</span>
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Médical</span>
              </TabsTrigger>
              <TabsTrigger value="photo" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Photo</span>
              </TabsTrigger>
              {showNotesTab && (
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Notes</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="basic" className="h-full overflow-auto">
                <UserDialogForm 
                  user={user} 
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  onCancel={handleCancel}
                  config={getConfig()}
                />
              </TabsContent>
              
              <TabsContent value="identity" className="h-full overflow-auto">
                <UserDialogForm 
                  user={user} 
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  onCancel={handleCancel}
                  config={getConfig()}
                />
              </TabsContent>
              
              <TabsContent value="professional" className="h-full overflow-auto">
                <UserDialogForm 
                  user={user} 
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  onCancel={handleCancel}
                  config={getConfig()}
                />
              </TabsContent>
              
              <TabsContent value="medical" className="h-full overflow-auto">
                <UserDialogForm 
                  user={user} 
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  onCancel={handleCancel}
                  config={getConfig()}
                />
              </TabsContent>
              
              <TabsContent value="photo" className="h-full overflow-auto">
                <UserDialogForm 
                  user={user} 
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  onCancel={handleCancel}
                  config={getConfig()}
                />
              </TabsContent>
              
              {showNotesTab && (
                <TabsContent value="notes" className="h-full overflow-auto p-4">
                  <EmployeeNotesTab user={user} />
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;

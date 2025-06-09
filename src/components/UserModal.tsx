
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRBAC } from '@/contexts/RBACContext';
import { User, UserRole, UserStatus } from '@/types/rbac';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  licenseNumber: string;
  totalTrips: number;
  lastTrip: string;
}

// Helper function to map roles to group IDs
const getGroupIdForRole = (role: UserRole): string => {
  switch (role) {
    case 'Administrator':
      return 'admin';
    case 'Employee':
      return 'employee';
    case 'Chef de Groupe Armé':
      return 'chef_groupe_arme';
    case 'Chef de Groupe Sans Armé':
      return 'chef_groupe_sans_arme';
    case 'Chauffeur Armé':
      return 'chauffeur_arme';
    case 'Chauffeur Sans Armé':
      return 'chauffeur_sans_arme';
    case 'APS Armé':
      return 'aps_arme';
    case 'APS Sans Armé':
      return 'aps_sans_arme';
    default:
      return 'employee';
  }
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const { addUser, updateUser } = useRBAC();
  
  const form = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'Employee',
      status: 'Active',
      licenseNumber: '',
      totalTrips: 0,
      lastTrip: '',
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        licenseNumber: user.licenseNumber || '',
        totalTrips: user.totalTrips || 0,
        lastTrip: user.lastTrip || '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        role: 'Employee',
        status: 'Active',
        licenseNumber: '',
        totalTrips: 0,
        lastTrip: '',
      });
    }
  }, [user, form]);

  const handleSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    
    try {
      const userData = {
        ...data,
        groupId: getGroupIdForRole(data.role),
        createdAt: user?.createdAt || new Date().toISOString(),
        licenseNumber: data.licenseNumber || undefined,
        totalTrips: data.totalTrips,
        lastTrip: data.lastTrip || undefined,
      };

      if (user) {
        await updateUser(user.id, userData);
      } else {
        await addUser(userData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedRole = form.watch('role');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Le nom est requis' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom Complet</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ex: Jean Dupont"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="ex: jean.dupont@entreprise.com"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                rules={{ required: 'Le téléphone est requis' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ex: +33 1 23 45 67 89"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                rules={{ required: 'Le rôle est requis' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Administrator">Administrateur</SelectItem>
                        <SelectItem value="Employee">Employé</SelectItem>
                        <SelectItem value="Chef de Groupe Armé">Chef de Groupe Armé</SelectItem>
                        <SelectItem value="Chef de Groupe Sans Armé">Chef de Groupe Sans Armé</SelectItem>
                        <SelectItem value="Chauffeur Armé">Chauffeur Armé</SelectItem>
                        <SelectItem value="Chauffeur Sans Armé">Chauffeur Sans Armé</SelectItem>
                        <SelectItem value="APS Armé">APS Armé</SelectItem>
                        <SelectItem value="APS Sans Armé">APS Sans Armé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              rules={{ required: 'Le statut est requis' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Actif</SelectItem>
                      <SelectItem value="Récupération">Récupération</SelectItem>
                      <SelectItem value="Congé">Congé</SelectItem>
                      <SelectItem value="Congé maladie">Congé maladie</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(watchedRole === 'Chauffeur Armé' || watchedRole === 'Chauffeur Sans Armé') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de Permis</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ex: DL123456789"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalTrips"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total des Voyages</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="0"
                          disabled={isSubmitting}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastTrip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dernier Voyage</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ex: 2024-01-15"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sauvegarde...' : (user ? 'Mettre à Jour l\'Utilisateur' : 'Créer l\'Utilisateur')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;

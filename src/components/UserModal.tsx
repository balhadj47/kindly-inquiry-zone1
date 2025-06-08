
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRBAC } from '@/contexts/RBACContext';
import { User, UserRole, UserStatus } from '@/types/rbac';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
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
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Chauffeur Armé' as UserRole,
    status: 'Active' as UserStatus,
    licenseNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        licenseNumber: user.licenseNumber || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Administrator',
        status: 'Active',
        licenseNumber: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const userData = {
        ...formData,
        groupId: getGroupIdForRole(formData.role), // Automatically assign group based on role
        createdAt: user?.createdAt || new Date().toISOString(),
        licenseNumber: (formData.role === 'Chauffeur Armé' || formData.role === 'Chauffeur Sans Armé') ? formData.licenseNumber : undefined,
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom Complet</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="ex: Jean Dupont"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="ex: jean.dupont@entreprise.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="ex: +33 1 23 45 67 89"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
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
          </div>

          {(formData.role === 'Chauffeur Armé' || formData.role === 'Chauffeur Sans Armé') && (
            <div className="space-y-2">
              <Label htmlFor="license-number">Numéro de Permis</Label>
              <Input
                id="license-number"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                placeholder="ex: DL123456789"
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as UserStatus)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Actif</SelectItem>
                <SelectItem value="Récupération">Récupération</SelectItem>
                <SelectItem value="Congé">Congé</SelectItem>
                <SelectItem value="Congé maladie">Congé maladie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sauvegarde...' : (user ? 'Mettre à Jour l\'Utilisateur' : 'Créer l\'Utilisateur')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;

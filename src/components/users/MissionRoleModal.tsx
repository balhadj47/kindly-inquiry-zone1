
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MissionRoleInfo, MissionRole } from '@/types/missionRoles';
import { MissionRolesService } from '@/services/missionRolesService';

interface MissionRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: MissionRoleInfo | null;
}

const ROLE_CATEGORIES = [
  { value: 'leadership', label: 'Direction' },
  { value: 'driver', label: 'Conduite' },
  { value: 'security', label: 'Sécurité' },
  { value: 'armed', label: 'Armé' },
];

const MISSION_ROLE_OPTIONS: { value: MissionRole; label: string }[] = [
  { value: 'Chef de Groupe', label: 'Chef de Groupe' },
  { value: 'Chauffeur', label: 'Chauffeur' },
  { value: 'APS', label: 'APS' },
  { value: 'Armé', label: 'Armé' },
];

const MissionRoleModal: React.FC<MissionRoleModalProps> = ({ isOpen, onClose, role }) => {
  const [formData, setFormData] = useState({
    name: 'APS' as MissionRole,
    description: '',
    category: 'security' as 'leadership' | 'driver' | 'security' | 'armed',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        category: role.category,
      });
    } else {
      setFormData({
        name: 'APS',
        description: '',
        category: 'security',
      });
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role) {
        await MissionRolesService.updateMissionRole(role.id, formData);
      } else {
        await MissionRolesService.addMissionRole(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving mission role template:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Modifier le Modèle de Rôle' : 'Nouveau Modèle de Rôle'}
          </DialogTitle>
          <DialogDescription>
            {role 
              ? 'Modifiez ce modèle de rôle de mission.'
              : 'Créez un nouveau modèle de rôle pour les missions. Ce modèle pourra être assigné aux utilisateurs lors de la création de missions.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Type de Rôle
              </Label>
              <Select
                value={formData.name}
                onValueChange={(value) => setFormData({ ...formData, name: value as MissionRole })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MISSION_ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
                required
                placeholder="Description du modèle de rôle..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Catégorie
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as any })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : (role ? 'Modifier' : 'Créer')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MissionRoleModal;

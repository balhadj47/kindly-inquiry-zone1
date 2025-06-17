
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MissionRoleInfo } from '@/types/missionRoles';
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

const MissionRoleModal: React.FC<MissionRoleModalProps> = ({ isOpen, onClose, role }) => {
  const [formData, setFormData] = useState({
    name: '',
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
        name: '',
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
      console.error('Error saving mission role:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Modifier le Rôle de Mission' : 'Nouveau Rôle de Mission'}
          </DialogTitle>
          <DialogDescription>
            {role 
              ? 'Modifiez les informations du rôle de mission.'
              : 'Créez un nouveau rôle de mission pour les opérations.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
                placeholder="ex: Chef de Groupe"
              />
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
                placeholder="Description du rôle..."
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

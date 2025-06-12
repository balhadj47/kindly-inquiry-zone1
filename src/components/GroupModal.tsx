
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRBAC } from '@/contexts/RBACContext';
import { Group } from '@/types/rbac';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
}

const GroupModal: React.FC<GroupModalProps> = ({ isOpen, onClose, group }) => {
  const { addGroup, updateGroup } = useRBAC();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { value: '#3b82f6', label: 'Blue', class: 'bg-blue-100 text-blue-800' },
    { value: '#10b981', label: 'Green', class: 'bg-green-100 text-green-800' },
    { value: '#ef4444', label: 'Red', class: 'bg-red-100 text-red-800' },
    { value: '#f59e0b', label: 'Yellow', class: 'bg-yellow-100 text-yellow-800' },
    { value: '#8b5cf6', label: 'Purple', class: 'bg-purple-100 text-purple-800' },
    { value: '#6b7280', label: 'Gray', class: 'bg-gray-100 text-gray-800' },
  ];

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        color: group.color,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#3b82f6',
      });
    }
  }, [group, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const groupData = {
        ...formData,
        permissions: group?.permissions || [],
      };

      if (group) {
        await updateGroup(group.id, groupData);
      } else {
        await addGroup(groupData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving group:', error);
      alert('Erreur lors de la sauvegarde du groupe. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedColorOption = colorOptions.find(option => option.value === formData.color);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {group ? 'Modifier le Groupe' : 'Ajouter un Nouveau Groupe'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du Groupe</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="ex: Managers"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="ex: Équipe de direction avec permissions élevées"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Couleur du Badge</Label>
            <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une couleur" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: option.value }}
                      ></div>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sauvegarde...' : (group ? 'Mettre à Jour le Groupe' : 'Créer le Groupe')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupModal;

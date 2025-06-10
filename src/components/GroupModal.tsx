
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
    color: 'bg-blue-100 text-blue-800',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { value: 'bg-blue-100 text-blue-800', label: 'Blue' },
    { value: 'bg-green-100 text-green-800', label: 'Green' },
    { value: 'bg-red-100 text-red-800', label: 'Red' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow' },
    { value: 'bg-purple-100 text-purple-800', label: 'Purple' },
    { value: 'bg-gray-100 text-gray-800', label: 'Gray' },
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
        color: 'bg-blue-100 text-blue-800',
      });
    }
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            {group ? 'Edit Group' : 'Add New Group'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Managers"
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
              placeholder="e.g., Management team with elevated permissions"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Badge Color</Label>
            <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded ${option.value}`}></div>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (group ? 'Update Group' : 'Create Group')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupModal;

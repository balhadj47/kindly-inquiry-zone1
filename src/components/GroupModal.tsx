
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRBAC } from '@/contexts/RBACContext';
import { UserGroup } from '@/types/rbac';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: UserGroup | null;
}

const GroupModal: React.FC<GroupModalProps> = ({ isOpen, onClose, group }) => {
  const { addGroup, updateGroup } = useRBAC();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-blue-100 text-blue-800',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const groupData = {
      ...formData,
      permissions: group?.permissions || [],
    };

    if (group) {
      updateGroup(group.id, groupData);
    } else {
      addGroup(groupData);
    }
    
    onClose();
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Badge Color</Label>
            <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {group ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupModal;

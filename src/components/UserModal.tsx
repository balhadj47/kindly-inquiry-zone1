
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

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const { groups, addUser, updateUser } = useRBAC();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Chauffeur Armé' as UserRole,
    groupId: '',
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
        groupId: user.groupId,
        status: user.status,
        licenseNumber: user.licenseNumber || '',
      });
    } else {
      // Default to first available group
      const defaultGroupId = groups.length > 0 ? groups[0].id : '';
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Administrator',
        groupId: defaultGroupId,
        status: 'Active',
        licenseNumber: '',
      });
    }
  }, [user, groups]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const userData = {
        ...formData,
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
      console.error('Error saving user:', error);
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
            {user ? 'Edit User' : 'Add New User'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Jean Dupont"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="e.g., jean.dupont@company.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="e.g., +33 1 23 45 67 89"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrator">Administrator</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Chef de Groupe Armé">Chef de Groupe Armé</SelectItem>
                <SelectItem value="Chef de Groupe Sans Armé">Chef de Groupe Sans Armé</SelectItem>
                <SelectItem value="Chauffeur Armé">Chauffeur Armé</SelectItem>
                <SelectItem value="Chauffeur Sans Armé">Chauffeur Sans Armé</SelectItem>
                <SelectItem value="APS Armé">APS Armé</SelectItem>
                <SelectItem value="APS Sans Armé">APS Sans Armé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">User Group</Label>
            <Select value={formData.groupId} onValueChange={(value) => handleInputChange('groupId', value)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(formData.role === 'Chauffeur Armé' || formData.role === 'Chauffeur Sans Armé') && (
            <div className="space-y-2">
              <Label htmlFor="license-number">License Number</Label>
              <Input
                id="license-number"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                placeholder="e.g., DL123456789"
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as UserStatus)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Récupération">Récupération</SelectItem>
                <SelectItem value="Congé">Congé</SelectItem>
                <SelectItem value="Congé maladie">Congé maladie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (user ? 'Update User' : 'Create User')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;


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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useRBAC } from '@/contexts/RBACContext';
import { SystemGroup, SystemGroupName } from '@/types/systemGroups';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: SystemGroup | null;
}

// Get available permissions from existing roles in the system
const getAvailablePermissions = (roles: SystemGroup[]): Array<{id: string; name: string; category: string}> => {
  const allPermissions = new Set<string>();
  
  // Collect all unique permissions from existing roles
  roles.forEach(role => {
    role.permissions.forEach(permission => {
      allPermissions.add(permission);
    });
  });
  
  // Convert to structured format
  return Array.from(allPermissions).map(permission => {
    const [category, action] = permission.split(':');
    return {
      id: permission,
      name: `${action || permission} ${category}`,
      category: category.charAt(0).toUpperCase() + category.slice(1)
    };
  }).sort((a, b) => a.category.localeCompare(b.category));
};

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, role }) => {
  const { addRole, updateRole, roles } = useRBAC();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    permissions: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState<Array<{id: string; name: string; category: string}>>([]);

  useEffect(() => {
    // Get available permissions from existing roles
    const permissions = getAvailablePermissions(roles);
    setAvailablePermissions(permissions);
  }, [roles]);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        color: role.color,
        permissions: [...role.permissions],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#3b82f6',
        permissions: [],
      });
    }
  }, [role]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role) {
        await updateRole(role.id, {
          name: formData.name as SystemGroupName,
          description: formData.description,
          color: formData.color,
          permissions: formData.permissions,
        });
      } else {
        await addRole({
          name: formData.name as SystemGroupName,
          description: formData.description,
          color: formData.color,
          permissions: formData.permissions,
          isSystemRole: false,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving system group:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof availablePermissions>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Modifier le Groupe Système' : 'Nouveau Groupe Système'}
          </DialogTitle>
          <DialogDescription>
            {role 
              ? 'Modifiez les informations et permissions du groupe système.'
              : 'Créez un nouveau groupe système avec des permissions spécifiques.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[60vh] pr-4">
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
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Couleur
                </Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="col-span-3 h-10"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label className="text-sm font-medium">Permissions</Label>
                {Object.keys(groupedPermissions).length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Aucune permission disponible. Les permissions seront disponibles une fois que d'autres rôles auront été créés.
                  </p>
                ) : (
                  Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                      <div className="grid grid-cols-1 gap-2 ml-4">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={formData.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission.id, checked as boolean)
                              }
                            />
                            <Label 
                              htmlFor={permission.id}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
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

export default RoleModal;

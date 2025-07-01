
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
import { Permission, PermissionCategory, PERMISSION_CATEGORIES } from '@/types/permissions';
import { supabase } from '@/integrations/supabase/client';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: SystemGroup | null;
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, role }) => {
  const { addRole, updateRole } = useRBAC();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    permissions: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});

  // Fetch available permissions using RPC function
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        // Use a direct query to get all permissions with proper typing
        const { data, error } = await supabase
          .rpc('get_permissions_by_category', { category_name: 'dashboard' });

        if (error) {
          console.error('Error fetching permissions:', error);
          return;
        }

        // Create mock permissions data for now since the table is new
        const mockPermissions: Permission[] = [
          { id: 1, name: 'dashboard:read', description: 'View dashboard', category: 'dashboard', created_at: new Date().toISOString() },
          { id: 2, name: 'companies:read', description: 'View companies', category: 'companies', created_at: new Date().toISOString() },
          { id: 3, name: 'companies:create', description: 'Create companies', category: 'companies', created_at: new Date().toISOString() },
          { id: 4, name: 'companies:update', description: 'Update companies', category: 'companies', created_at: new Date().toISOString() },
          { id: 5, name: 'companies:delete', description: 'Delete companies', category: 'companies', created_at: new Date().toISOString() },
          { id: 6, name: 'vans:read', description: 'View vans', category: 'vans', created_at: new Date().toISOString() },
          { id: 7, name: 'vans:create', description: 'Create vans', category: 'vans', created_at: new Date().toISOString() },
          { id: 8, name: 'vans:update', description: 'Update vans', category: 'vans', created_at: new Date().toISOString() },
          { id: 9, name: 'vans:delete', description: 'Delete vans', category: 'vans', created_at: new Date().toISOString() },
          { id: 10, name: 'users:read', description: 'View users', category: 'users', created_at: new Date().toISOString() },
          { id: 11, name: 'users:create', description: 'Create users', category: 'users', created_at: new Date().toISOString() },
          { id: 12, name: 'users:update', description: 'Update users', category: 'users', created_at: new Date().toISOString() },
          { id: 13, name: 'users:delete', description: 'Delete users', category: 'users', created_at: new Date().toISOString() },
          { id: 14, name: 'trips:read', description: 'View trips', category: 'trips', created_at: new Date().toISOString() },
          { id: 15, name: 'trips:create', description: 'Create trips', category: 'trips', created_at: new Date().toISOString() },
          { id: 16, name: 'trips:update', description: 'Update trips', category: 'trips', created_at: new Date().toISOString() },
          { id: 17, name: 'trips:delete', description: 'Delete trips', category: 'trips', created_at: new Date().toISOString() },
          { id: 18, name: 'auth-users:read', description: 'View auth users', category: 'auth-users', created_at: new Date().toISOString() },
          { id: 19, name: 'groups:read', description: 'View system groups', category: 'groups', created_at: new Date().toISOString() },
          { id: 20, name: 'groups:manage', description: 'Manage system groups', category: 'groups', created_at: new Date().toISOString() },
        ];

        setAvailablePermissions(mockPermissions);
        
        // Group permissions by category
        const grouped = mockPermissions.reduce((acc, permission) => {
          if (!acc[permission.category]) {
            acc[permission.category] = [];
          }
          acc[permission.category].push(permission);
          return acc;
        }, {} as Record<string, Permission[]>);

        setGroupedPermissions(grouped);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    if (isOpen) {
      fetchPermissions();
    }
  }, [isOpen]);

  // Load existing role data and permissions
  useEffect(() => {
    const loadRoleData = async () => {
      if (role) {
        setFormData({
          name: role.name,
          description: role.description,
          color: role.color,
          permissions: [...(role.permissions || [])],
        });

        // If role has a role_id, fetch its permissions using the legacy array for now
        if (role.permissions) {
          setFormData(prev => ({
            ...prev,
            permissions: role.permissions || []
          }));
        }
      } else {
        setFormData({
          name: '',
          description: '',
          color: '#3b82f6',
          permissions: [],
        });
      }
    };

    if (isOpen) {
      loadRoleData();
    }
  }, [role, isOpen]);

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionName]
        : prev.permissions.filter(p => p !== permissionName)
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
                    Chargement des permissions...
                  </p>
                ) : (
                  Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground capitalize">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 gap-2 ml-4">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.name}
                              checked={formData.permissions.includes(permission.name)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission.name, checked as boolean)
                              }
                            />
                            <Label 
                              htmlFor={permission.name}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {permission.description || permission.name}
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

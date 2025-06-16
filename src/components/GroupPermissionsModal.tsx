
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRBAC } from '@/contexts/RBACContext';
import { Group, Permission } from '@/types/rbac';
import PermissionTemplates, { PermissionTemplate } from './users/PermissionTemplates';

interface GroupPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
}

const GroupPermissionsModal: React.FC<GroupPermissionsModalProps> = ({ isOpen, onClose, group }) => {
  const { permissions, updateGroup } = useRBAC();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (group) {
      setSelectedPermissions(group.permissions);
    }
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (group) {
        console.log('Updating group permissions:', group.id, selectedPermissions);
        await updateGroup(group.id, { permissions: selectedPermissions });
        console.log('Group permissions updated successfully');
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Erreur lors de la mise à jour des permissions. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleApplyTemplate = (template: PermissionTemplate) => {
    setSelectedPermissions(template.permissions);
  };

  const handleBulkAction = (action: 'selectAll' | 'deselectAll' | 'selectCategory', category?: string) => {
    switch (action) {
      case 'selectAll':
        setSelectedPermissions(permissions.map(p => p.id));
        break;
      case 'deselectAll':
        setSelectedPermissions([]);
        break;
      case 'selectCategory':
        if (category) {
          const categoryPermissions = permissions
            .filter(p => p.category === category)
            .map(p => p.id);
          setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
        }
        break;
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleSelectAll = (category: string, permissions: Permission[]) => {
    const categoryPermissionIds = permissions.map(p => p.id);
    const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !categoryPermissionIds.includes(id)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissionIds])]);
    }
  };

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Gérer les Permissions pour {group.name}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="permissions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="permissions">Permissions Détaillées</TabsTrigger>
            <TabsTrigger value="templates">Modèles Rapides</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            <PermissionTemplates
              onApplyTemplate={handleApplyTemplate}
              selectedPermissions={selectedPermissions}
            />
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bulk Actions */}
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('selectAll')}
                  disabled={isSubmitting}
                >
                  Tout Sélectionner
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('deselectAll')}
                  disabled={isSubmitting}
                >
                  Tout Désélectionner
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                  const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p.id));
                  
                  return (
                    <Card key={category}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base capitalize">{category}</CardTitle>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectAll(category, categoryPermissions)}
                            disabled={isSubmitting}
                          >
                            {allSelected ? 'Tout Désélectionner' : 'Tout Sélectionner'}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission.id, checked as boolean)
                              }
                              disabled={isSubmitting}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor={permission.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {permission.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  {selectedPermissions.length} sur {permissions.length} permissions sélectionnées
                </p>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder les Permissions'}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GroupPermissionsModal;

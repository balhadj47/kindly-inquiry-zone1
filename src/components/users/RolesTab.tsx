
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Shield, Edit, Trash } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { SystemGroup } from '@/types/systemGroups';
import RoleModal from './RoleModal';
import RoleDeleteDialog from './RoleDeleteDialog';

const RolesTab: React.FC = () => {
  const { roles, hasPermission } = useRBAC();
  const [selectedRole, setSelectedRole] = useState<SystemGroup | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<SystemGroup | null>(null);

  const canManageGroups = hasPermission('groups:manage');
  const canReadGroups = hasPermission('groups:read');

  if (!canReadGroups) {
    return (
      <TabsContent value="roles" className="space-y-4">
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour voir les groupes système.
          </p>
        </div>
      </TabsContent>
    );
  }

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsRoleModalOpen(true);
  };

  const handleEditRole = (role: SystemGroup) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = (role: SystemGroup) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRole(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  return (
    <TabsContent value="roles" className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Groupes Système</h2>
          <p className="text-muted-foreground">
            Gérez les groupes système et leurs permissions d'accès
          </p>
        </div>
        {canManageGroups && (
          <Button onClick={handleAddRole}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Groupe
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: role.color }}
                  />
                  <span className="text-lg">{role.name}</span>
                </CardTitle>
                {canManageGroups && (
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteRole(role)}
                      disabled={role.isSystemRole}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{role.permissions.length} permissions</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Permissions:</h4>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge 
                        key={permission} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {permission.split(':')[0]}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} plus
                      </Badge>
                    )}
                  </div>
                </div>
                
                {role.isSystemRole && (
                  <Badge variant="outline" className="text-xs">
                    Groupe Système
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {roles.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Aucun groupe système trouvé.
          </p>
          {canManageGroups && (
            <Button onClick={handleAddRole}>
              <Plus className="h-4 w-4 mr-2" />
              Créer le premier groupe
            </Button>
          )}
        </div>
      )}

      <RoleModal 
        isOpen={isRoleModalOpen}
        onClose={handleCloseModal}
        role={selectedRole}
      />

      <RoleDeleteDialog 
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        role={roleToDelete}
      />
    </TabsContent>
  );
};

export default RolesTab;

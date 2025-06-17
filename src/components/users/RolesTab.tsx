
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Shield, Edit, Trash } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { Role } from '@/types/rbac';

const RolesTab: React.FC = () => {
  const { roles, hasPermission } = useRBAC();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const canManageRoles = hasPermission('groups:manage');
  const canReadRoles = hasPermission('groups:read');

  if (!canReadRoles) {
    return (
      <TabsContent value="roles" className="space-y-4">
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour voir les rôles.
          </p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="roles" className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rôles et Permissions</h2>
          <p className="text-muted-foreground">
            Gérez les rôles d'utilisateurs et leurs permissions
          </p>
        </div>
        {canManageRoles && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Rôle
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
                {canManageRoles && (
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedRole(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
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
                    Rôle Système
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
            Aucun rôle trouvé.
          </p>
          {canManageRoles && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer le premier rôle
            </Button>
          )}
        </div>
      )}
    </TabsContent>
  );
};

export default RolesTab;

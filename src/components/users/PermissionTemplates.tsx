
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Car, Building, Eye } from 'lucide-react';

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  permissions: string[];
}

export const PERMISSION_TEMPLATES: PermissionTemplate[] = [
  {
    id: 'full-admin',
    name: 'Administrateur Complet',
    description: 'Accès total à toutes les fonctionnalités',
    icon: Shield,
    color: 'bg-red-100 text-red-800',
    permissions: [
      'users:read', 'users:create', 'users:update', 'users:delete',
      'groups:read', 'groups:create', 'groups:update', 'groups:delete',
      'vans:read', 'vans:create', 'vans:update', 'vans:delete',
      'trips:read', 'trips:create', 'trips:update', 'trips:delete',
      'companies:read', 'companies:create', 'companies:update', 'companies:delete',
      'dashboard:read', 'settings:read', 'settings:update'
    ]
  },
  {
    id: 'supervisor',
    name: 'Superviseur',
    description: 'Gestion des équipes et supervision',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    permissions: [
      'users:read', 'users:update',
      'vans:read', 'vans:update',
      'trips:read', 'trips:create', 'trips:update',
      'companies:read',
      'dashboard:read'
    ]
  },
  {
    id: 'driver-manager',
    name: 'Gestionnaire de Flotte',
    description: 'Gestion des véhicules et trajets',
    icon: Car,
    color: 'bg-green-100 text-green-800',
    permissions: [
      'vans:read', 'vans:create', 'vans:update',
      'trips:read', 'trips:create', 'trips:update',
      'dashboard:read'
    ]
  },
  {
    id: 'hr-manager',
    name: 'Ressources Humaines',
    description: 'Gestion du personnel',
    icon: Users,
    color: 'bg-purple-100 text-purple-800',
    permissions: [
      'users:read', 'users:create', 'users:update',
      'groups:read',
      'dashboard:read'
    ]
  },
  {
    id: 'read-only',
    name: 'Lecture Seule',
    description: 'Accès en consultation uniquement',
    icon: Eye,
    color: 'bg-gray-100 text-gray-800',
    permissions: [
      'users:read',
      'groups:read',
      'vans:read',
      'trips:read',
      'companies:read',
      'dashboard:read'
    ]
  }
];

interface PermissionTemplatesProps {
  onApplyTemplate: (template: PermissionTemplate) => void;
  selectedPermissions: string[];
}

const PermissionTemplates: React.FC<PermissionTemplatesProps> = ({
  onApplyTemplate,
  selectedPermissions,
}) => {
  const getTemplateMatch = (template: PermissionTemplate) => {
    const matchingPermissions = template.permissions.filter(p => selectedPermissions.includes(p));
    return Math.round((matchingPermissions.length / template.permissions.length) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Modèles de Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PERMISSION_TEMPLATES.map((template) => {
            const IconComponent = template.icon;
            const matchPercentage = getTemplateMatch(template);
            
            return (
              <div key={template.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="font-medium text-sm">{template.name}</span>
                  </div>
                  {matchPercentage > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {matchPercentage}% match
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className={`${template.color} text-xs`}>
                    {template.permissions.length} permissions
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onApplyTemplate(template)}
                    className="text-xs h-7"
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionTemplates;

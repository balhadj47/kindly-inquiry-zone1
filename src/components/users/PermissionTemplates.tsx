
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  permissions: string[];
}

// No predefined templates - all permissions come from database
export const PERMISSION_TEMPLATES: PermissionTemplate[] = [];

interface PermissionTemplatesProps {
  onApplyTemplate: (template: PermissionTemplate) => void;
  selectedPermissions: string[];
}

const PermissionTemplates: React.FC<PermissionTemplatesProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Modèles de Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-gray-500">
            Les modèles de permissions sont générés automatiquement à partir des rôles existants dans la base de données.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionTemplates;

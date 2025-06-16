
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  permissions: string[];
}

// Empty array - no demo data
export const PERMISSION_TEMPLATES: PermissionTemplate[] = [];

interface PermissionTemplatesProps {
  onApplyTemplate: (template: PermissionTemplate) => void;
  selectedPermissions: string[];
}

const PermissionTemplates: React.FC<PermissionTemplatesProps> = ({
  onApplyTemplate,
  selectedPermissions,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Modèles de Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-gray-500">Aucun modèle de permission disponible.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionTemplates;

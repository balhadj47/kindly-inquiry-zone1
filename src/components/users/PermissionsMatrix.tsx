
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Users, Shield } from 'lucide-react';
import { Group, Permission } from '@/types/rbac';

interface PermissionsMatrixProps {
  groups: Group[];
  permissions: Permission[];
  onManagePermissions: (group: Group) => void;
}

const PermissionsMatrix: React.FC<PermissionsMatrixProps> = ({
  groups,
  permissions,
  onManagePermissions,
}) => {
  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const hasPermission = (group: Group, permissionId: string) => {
    return group.permissions.includes(permissionId);
  };

  const getPermissionCoverage = (group: Group) => {
    const totalPermissions = permissions.length;
    const groupPermissions = group.permissions.length;
    return Math.round((groupPermissions / totalPermissions) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Matrice des Permissions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Groups Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => {
              const coverage = getPermissionCoverage(group);
              return (
                <div key={group.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{group.name}</h4>
                    <Badge className={group.color}>{coverage}%</Badge>
                  </div>
                  <div className="text-xs text-gray-600 mb-3">
                    {group.permissions.length} sur {permissions.length} permissions
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManagePermissions(group)}
                    className="w-full text-xs"
                  >
                    Gérer
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Detailed Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border font-medium">Permission</th>
                  {groups.map((group) => (
                    <th key={group.id} className="text-center p-2 border font-medium min-w-[100px]">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-xs">{group.name}</span>
                        <Badge className={`${group.color} text-xs`}>
                          {group.permissions.length}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                  <React.Fragment key={category}>
                    <tr>
                      <td colSpan={groups.length + 1} className="bg-gray-50 p-2 border font-medium text-sm">
                        {category}
                      </td>
                    </tr>
                    {categoryPermissions.map((permission) => (
                      <tr key={permission.id} className="hover:bg-gray-50">
                        <td className="p-2 border text-sm">
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-xs text-gray-600">{permission.description}</div>
                          </div>
                        </td>
                        {groups.map((group) => (
                          <td key={`${group.id}-${permission.id}`} className="p-2 border text-center">
                            {hasPermission(group, permission.id) ? (
                              <Check className="h-4 w-4 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-gray-300 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsMatrix;

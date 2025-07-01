
import React from 'react';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PermissionsDebug = () => {
  const { user: authUser } = useAuth();
  const permissions = useSecurePermissions();

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Auth User ID:</strong> {authUser?.id || 'Not logged in'}</p>
            <p><strong>Auth User Email:</strong> {authUser?.email || 'No email'}</p>
            <p><strong>Is Authenticated:</strong> {permissions.isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Is Admin:</strong> {permissions.isAdmin ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Database Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Current User:</strong> {permissions.currentUser ? JSON.stringify(permissions.currentUser, null, 2) : 'No user data'}</p>
            <p><strong>User Role Info:</strong></p>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {permissions.userRoleInfo ? JSON.stringify(permissions.userRoleInfo, null, 2) : 'No role info'}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Badge variant={permissions.canAccessDashboard ? "default" : "destructive"}>
                Dashboard: {permissions.canAccessDashboard ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <Badge variant={permissions.canReadCompanies ? "default" : "destructive"}>
                Companies Read: {permissions.canReadCompanies ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <Badge variant={permissions.canCreateCompanies ? "default" : "destructive"}>
                Companies Create: {permissions.canCreateCompanies ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <Badge variant={permissions.canUpdateCompanies ? "default" : "destructive"}>
                Companies Update: {permissions.canUpdateCompanies ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <Badge variant={permissions.canDeleteCompanies ? "default" : "destructive"}>
                Companies Delete: {permissions.canDeleteCompanies ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <Badge variant={permissions.canReadVans ? "default" : "destructive"}>
                Vans Read: {permissions.canReadVans ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <Badge variant={permissions.canReadUsers ? "default" : "destructive"}>
                Users Read: {permissions.canReadUsers ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <Badge variant={permissions.canReadTrips ? "default" : "destructive"}>
                Trips Read: {permissions.canReadTrips ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsDebug;

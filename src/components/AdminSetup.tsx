
import React from 'react';
import { useAdminSetup } from '@/hooks/useAdminSetup';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AdminSetup = () => {
  const { roles, createAdminRole, assignUserToAdmin } = useAdminSetup();
  const permissions = useSecurePermissions();

  const currentUser = permissions.currentUser;
  const hasNoRole = currentUser && !currentUser.role_id;
  
  console.log('🔧 AdminSetup: Current state:', {
    currentUser: currentUser?.id,
    hasRole: !!currentUser?.role_id,
    rolesCount: roles.length,
    hasAdminRole: roles.some(r => r.role_id === 1)
  });

  const handleCreateAdminRole = async () => {
    try {
      await createAdminRole.mutateAsync();
    } catch (error) {
      console.error('Failed to create admin role:', error);
    }
  };

  const handleAssignToAdmin = async () => {
    if (!currentUser?.id) return;
    
    try {
      await assignUserToAdmin.mutateAsync(currentUser.id);
    } catch (error) {
      console.error('Failed to assign user to admin:', error);
    }
  };

  const hasAdminRole = roles.some(r => r.role_id === 1);

  if (!hasNoRole) {
    return null; // User already has a role
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800">Role Setup Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-orange-700">
          Your user account exists but has no role assigned. This is why you can't see companies and branches.
        </p>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Available Roles: {roles.length}</p>
          <p className="text-sm">Has Admin Role: {hasAdminRole ? 'Yes' : 'No'}</p>
        </div>

        <div className="flex gap-2">
          {!hasAdminRole && (
            <Button 
              onClick={handleCreateAdminRole}
              disabled={createAdminRole.isPending}
              variant="outline"
            >
              {createAdminRole.isPending ? 'Creating...' : 'Create Admin Role'}
            </Button>
          )}
          
          {hasAdminRole && (
            <Button 
              onClick={handleAssignToAdmin}
              disabled={assignUserToAdmin.isPending}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {assignUserToAdmin.isPending ? 'Assigning...' : 'Assign Me to Admin Role'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSetup;

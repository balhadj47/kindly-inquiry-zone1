
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRBAC } from '@/contexts/RBACContext';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  phone: string | null;
  role: string;
  user_metadata: any;
}

interface AuthUserEditDialogProps {
  isOpen: boolean;
  user: AuthUser | null;
  onConfirm: (updateData: { email?: string; role_id?: number; name?: string }) => void;
  onCancel: () => void;
}

const AuthUserEditDialog: React.FC<AuthUserEditDialogProps> = ({
  isOpen,
  user,
  onConfirm,
  onCancel,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [roleId, setRoleId] = useState<number>(2);
  const { roles } = useRBAC();

  const availableRoles = React.useMemo(() => {
    if (!roles || !Array.isArray(roles)) {
      console.log('🔍 AuthUserEditDialog: No roles available or not an array:', roles);
      return [];
    }
    
    console.log('🔍 AuthUserEditDialog: All roles from RBAC:', roles);
    
    // Show ALL roles - don't filter out any roles for auth user editing
    const processedRoles = roles.map(role => {
      const roleIdNum = (role as any).role_id;
      const roleName = role.name || `Role ${roleIdNum}`;
      
      console.log('🔍 AuthUserEditDialog: Processing role:', {
        role_id: roleIdNum,
        name: roleName,
        fullRole: role
      });
      
      return {
        role_id: roleIdNum,
        name: roleName
      };
    }).filter(role => role.role_id != null); // Only filter out roles without role_id
    
    console.log('🔍 AuthUserEditDialog: Final available roles:', processedRoles);
    return processedRoles;
  }, [roles]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setName(user.user_metadata?.name || '');
      setRoleId(user.user_metadata?.role_id || 2);
      
      console.log('🔍 AuthUserEditDialog: Setting user data:', {
        email: user.email,
        name: user.user_metadata?.name,
        role_id: user.user_metadata?.role_id,
        user_metadata: user.user_metadata
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const updateData: { email?: string; role_id?: number; name?: string } = {};
    
    if (email !== user.email) {
      updateData.email = email;
    }
    
    if (name !== (user.user_metadata?.name || '')) {
      updateData.name = name;
    }
    
    if (roleId !== (user.user_metadata?.role_id || 2)) {
      updateData.role_id = roleId;
    }

    console.log('🔍 AuthUserEditDialog: Submitting update data:', updateData);
    onConfirm(updateData);
  };

  const handleCancel = () => {
    if (user) {
      setEmail(user.email || '');
      setName(user.user_metadata?.name || '');
      setRoleId(user.user_metadata?.role_id || 2);
    }
    onCancel();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => handleCancel()}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-xl">Modifier l'utilisateur d'authentification</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Nom</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom d'utilisateur"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">Rôle</Label>
            <Select value={roleId.toString()} onValueChange={(value) => setRoleId(parseInt(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.length > 0 ? (
                  availableRoles.map((role) => (
                    <SelectItem key={role.role_id} value={role.role_id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="2" disabled>Chargement des rôles...</SelectItem>
                )}
              </SelectContent>
            </Select>
            {availableRoles.length === 0 && (
              <p className="text-sm text-gray-500">
                Aucun rôle disponible. Vérifiez la configuration des rôles.
              </p>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              Annuler
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Sauvegarder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthUserEditDialog;

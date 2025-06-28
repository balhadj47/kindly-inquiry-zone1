
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
      return [];
    }
    
    return roles.filter(role => {
      const roleIdNum = (role as any).role_id;
      return roleIdNum && roleIdNum !== 3; // Exclude Employee role
    });
  }, [roles]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setName(user.user_metadata?.name || '');
      setRoleId(user.user_metadata?.role_id || 2);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur d'authentification</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom d'utilisateur"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={roleId.toString()} onValueChange={(value) => setRoleId(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.length > 0 ? (
                  availableRoles.map((role) => (
                    <SelectItem key={(role as any).role_id} value={(role as any).role_id.toString()}>
                      {role.name || 'Rôle sans nom'}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="2" disabled>Aucun rôle disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Sauvegarder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthUserEditDialog;


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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthUserCreateDialogProps {
  isOpen: boolean;
  onConfirm: (userData: { email: string; password: string; name: string; role_id: number }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface DatabaseGroup {
  id: string;
  name: string;
  description: string;
  role_id: number;
  permissions: string[];
}

const AuthUserCreateDialog: React.FC<AuthUserCreateDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roleId, setRoleId] = useState<number>(2);
  const [groups, setGroups] = useState<DatabaseGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const { toast } = useToast();

  // Fetch groups from database
  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      console.log('🔄 Fetching groups from database...');
      
      const { data, error } = await supabase
        .from('user_groups')
        .select('*')
        .order('role_id', { ascending: true });

      if (error) {
        console.error('❌ Error fetching groups:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les groupes système.',
          variant: 'destructive',
        });
        return;
      }

      const transformedGroups: DatabaseGroup[] = (data || []).map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        role_id: group.role_id || 3,
        permissions: group.permissions || [],
      }));

      console.log('✅ Groups loaded from database:', transformedGroups);
      setGroups(transformedGroups);
      
      // Set default role to first available group or 2 (Supervisor)
      if (transformedGroups.length > 0) {
        setRoleId(transformedGroups[0].role_id);
      }
    } catch (error) {
      console.error('❌ Exception fetching groups:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des groupes.',
        variant: 'destructive',
      });
    } finally {
      setLoadingGroups(false);
    }
  };

  // Load groups when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setRoleId(2);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      return;
    }

    onConfirm({
      email,
      password,
      name,
      role_id: roleId,
    });
  };

  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRoleId(2);
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleCancel()}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-xl">Créer un nouvel utilisateur d'authentification</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
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
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">Rôle</Label>
            <Select 
              value={roleId.toString()} 
              onValueChange={(value) => setRoleId(parseInt(value))}
              disabled={loadingGroups}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loadingGroups ? "Chargement..." : "Sélectionner un rôle"} />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.role_id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{group.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {group.description} ({group.permissions.length} permissions)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading} className="w-full sm:w-auto">
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || loadingGroups} className="w-full sm:w-auto">
              {isLoading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthUserCreateDialog;

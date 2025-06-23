
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshButton } from '@/components/ui/refresh-button';
import { Trash, Mail, Clock, Shield, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthUserDeleteDialog from './auth-users/AuthUserDeleteDialog';

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

const AuthUsers = () => {
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const { toast } = useToast();

  const fetchAuthUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching auth users...');
      
      // Get auth users via admin API
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('Error fetching auth users:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les utilisateurs d\'authentification',
          variant: 'destructive',
        });
        return;
      }

      const formattedUsers: AuthUser[] = users.map(user => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        phone: user.phone,
        role: user.role || 'authenticated',
        user_metadata: user.user_metadata || {},
      }));

      setAuthUsers(formattedUsers);
      console.log('✅ Auth users loaded:', formattedUsers.length);
    } catch (error) {
      console.error('Error in fetchAuthUsers:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du chargement',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthUsers();
  }, []);

  const handleDeleteUser = (user: AuthUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      console.log('🗑️ Deleting auth user:', selectedUser.id);
      
      const { error } = await supabase.auth.admin.deleteUser(selectedUser.id);
      
      if (error) {
        console.error('Error deleting auth user:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer l\'utilisateur',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Succès',
        description: 'Utilisateur supprimé avec succès',
      });

      // Refresh the list
      fetchAuthUsers();
    } catch (error) {
      console.error('Error in handleConfirmDelete:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = authUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (user: AuthUser) => {
    if (user.email_confirmed_at) {
      return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des utilisateurs d'authentification...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Utilisateurs d'Authentification</h1>
          <p className="text-gray-600">Gérer les utilisateurs Supabase Auth</p>
        </div>
        <RefreshButton onRefresh={fetchAuthUsers} />
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Cette page permet de gérer les utilisateurs d'authentification Supabase. 
          Soyez prudent lors de la suppression d'utilisateurs car cette action est irréversible.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par email ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <span>{user.email}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(user)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">ID:</span> {user.id}
                  </div>
                  <div>
                    <span className="font-medium">Rôle:</span> {user.role}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Créé:</span> 
                    <span>{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Dernière connexion:</span> 
                    <span>
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString('fr-FR')
                        : 'Jamais'
                      }
                    </span>
                  </div>
                  {user.phone && (
                    <div>
                      <span className="font-medium">Téléphone:</span> {user.phone}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Email confirmé:</span> 
                    {user.email_confirmed_at 
                      ? new Date(user.email_confirmed_at).toLocaleDateString('fr-FR')
                      : 'Non'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      <AuthUserDeleteDialog
        isOpen={isDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default AuthUsers;

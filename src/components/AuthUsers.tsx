
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshButton } from '@/components/ui/refresh-button';
import { Mail, Clock, Shield, Search, AlertTriangle, ExternalLink, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthUserDeleteDialog from '@/components/auth-users/AuthUserDeleteDialog';
import AuthUserEditDialog from '@/components/auth-users/AuthUserEditDialog';

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
  const [showAdminError, setShowAdminError] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; user: AuthUser | null }>({
    isOpen: false,
    user: null
  });
  const [editDialog, setEditDialog] = useState<{ isOpen: boolean; user: AuthUser | null }>({
    isOpen: false,
    user: null
  });
  const { toast } = useToast();

  const fetchAuthUsers = async () => {
    try {
      setLoading(true);
      setShowAdminError(false);
      console.log('🔍 Fetching auth users via Edge Function...');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase.functions.invoke('auth-users', {
        method: 'GET',
      });

      if (error) {
        if (error.message.includes('403') || error.message.includes('Insufficient permissions')) {
          setShowAdminError(true);
          return;
        }
        throw error;
      }

      setAuthUsers(data.users || []);
      console.log('✅ Auth users loaded:', data.users?.length || 0);
    } catch (error) {
      console.error('Error fetching auth users:', error);
      setShowAdminError(true);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du chargement des utilisateurs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      console.log('🗑️ Deleting auth user:', userId);
      
      const { error } = await supabase.functions.invoke('auth-users', {
        method: 'DELETE',
        body: { userId },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Succès',
        description: 'Utilisateur d\'authentification supprimé avec succès',
      });

      await fetchAuthUsers();
    } catch (error) {
      console.error('Error deleting auth user:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression de l\'utilisateur',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUser = async (userId: string, updateData: { email?: string; role_id?: number; name?: string }) => {
    try {
      console.log('📝 Updating auth user:', userId, updateData);
      
      const { error } = await supabase.functions.invoke('auth-users', {
        method: 'PUT',
        body: { userId, updateData },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Succès',
        description: 'Utilisateur d\'authentification modifié avec succès',
      });

      await fetchAuthUsers();
    } catch (error) {
      console.error('Error updating auth user:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la modification de l\'utilisateur',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAuthUsers();
  }, []);

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

  const getRoleBadge = (user: AuthUser) => {
    const roleId = user.user_metadata?.role_id || 2;
    if (roleId === 1) {
      return <Badge className="bg-red-100 text-red-800">Administrateur</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Superviseur</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des utilisateurs d'authentification...</div>
      </div>
    );
  }

  if (showAdminError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Utilisateurs d'Authentification</h1>
            <p className="text-gray-600">Gérer les utilisateurs Supabase Auth</p>
          </div>
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Permissions insuffisantes</strong>
            <br />
            Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité.
            Seuls les administrateurs peuvent gérer les utilisateurs d'authentification.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span>Tableau de bord Supabase</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Vous pouvez gérer les utilisateurs d'authentification directement via le tableau de bord Supabase :
            </p>
            <Button 
              onClick={() => window.open('https://supabase.com/dashboard/project/upaxlykqpbpvwsprcrtu/auth/users', '_blank')}
              className="w-full flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Ouvrir le tableau de bord Supabase</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Utilisateurs d'Authentification</h1>
          <p className="text-gray-600">Gérer les utilisateurs Supabase Auth ({authUsers.length} utilisateur{authUsers.length !== 1 ? 's' : ''})</p>
        </div>
        <RefreshButton onRefresh={fetchAuthUsers} />
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Cette page affiche les utilisateurs d'authentification Supabase avec gestion complète via Edge Functions.
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
                    {getRoleBadge(user)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditDialog({ isOpen: true, user })}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog({ isOpen: true, user })}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">ID:</span> 
                    <span className="text-xs text-gray-500 ml-1">{user.id}</span>
                  </div>
                  <div>
                    <span className="font-medium">Nom:</span> {user.user_metadata?.name || 'Non défini'}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      <AuthUserDeleteDialog
        isOpen={deleteDialog.isOpen}
        user={deleteDialog.user}
        onConfirm={() => {
          if (deleteDialog.user) {
            handleDeleteUser(deleteDialog.user.id);
          }
          setDeleteDialog({ isOpen: false, user: null });
        }}
        onCancel={() => setDeleteDialog({ isOpen: false, user: null })}
      />

      <AuthUserEditDialog
        isOpen={editDialog.isOpen}
        user={editDialog.user}
        onConfirm={(updateData) => {
          if (editDialog.user) {
            handleUpdateUser(editDialog.user.id, updateData);
          }
          setEditDialog({ isOpen: false, user: null });
        }}
        onCancel={() => setEditDialog({ isOpen: false, user: null })}
      />
    </div>
  );
};

export default AuthUsers;

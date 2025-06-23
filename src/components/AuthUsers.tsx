
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshButton } from '@/components/ui/refresh-button';
import { Mail, Clock, Shield, Search, AlertTriangle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { toast } = useToast();

  const checkAdminAccess = async () => {
    try {
      setLoading(true);
      console.log('🔍 Checking admin access for auth users...');
      
      // Try to get auth users via admin API
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('Admin API error:', error);
        setShowAdminError(true);
        setLoading(false);
        return;
      }

      // If we get here, we have admin access
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
      console.error('Error checking admin access:', error);
      setShowAdminError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminAccess();
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
            Cette fonctionnalité nécessite des permissions d'administrateur service (service_role) 
            qui ne sont pas disponibles depuis l'interface utilisateur pour des raisons de sécurité.
            <br /><br />
            Pour accéder à cette fonctionnalité, vous pouvez :
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Utiliser le tableau de bord Supabase directement</li>
              <li>Configurer une fonction Edge avec les permissions service_role</li>
              <li>Demander à un administrateur système d'activer ces permissions</li>
            </ul>
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
        <RefreshButton onRefresh={checkAdminAccess} />
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Cette page affiche les utilisateurs d'authentification Supabase. 
          Les fonctionnalités de modification nécessitent des permissions d'administrateur service.
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

        {filteredUsers.length === 0 && !loading && !showAdminError && (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthUsers;

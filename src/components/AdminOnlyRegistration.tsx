
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, UserPlus } from 'lucide-react';

const AdminOnlyRegistration: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Inscription Restreinte</CardTitle>
        <CardDescription>
          L'inscription publique est désactivée
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <UserPlus className="h-6 w-6 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Seuls les administrateurs peuvent créer de nouveaux comptes utilisateur.
          </p>
        </div>
        <div className="text-xs text-gray-500">
          <p>Si vous avez déjà un compte, vous pouvez vous connecter.</p>
          <p>Pour obtenir un compte, contactez votre administrateur.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOnlyRegistration;

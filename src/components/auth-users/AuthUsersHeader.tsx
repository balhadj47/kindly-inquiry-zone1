
import React from 'react';
import { Shield } from 'lucide-react';

interface AuthUsersHeaderProps {
  authUsersCount: number;
}

const AuthUsersHeader: React.FC<AuthUsersHeaderProps> = ({ 
  authUsersCount 
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Shield className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Comptes</h1>
        <p className="text-gray-600 mt-1">
          {authUsersCount} compte{authUsersCount !== 1 ? 's' : ''} d'authentification
        </p>
      </div>
    </div>
  );
};

export default AuthUsersHeader;

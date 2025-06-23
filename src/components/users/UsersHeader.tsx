
import React from 'react';
import { Users } from 'lucide-react';

const UsersHeader = () => {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <Users className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
      </div>
      <p className="text-gray-600">
        Gérer les administrateurs et superviseurs du système
      </p>
    </div>
  );
};

export default UsersHeader;

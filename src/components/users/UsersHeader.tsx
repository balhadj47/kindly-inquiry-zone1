
import React from 'react';
import { Users, Settings } from 'lucide-react';

const UsersHeader = () => {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Settings className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-1">
            Gérer les administrateurs et superviseurs du système
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsersHeader;

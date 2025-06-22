
import React from 'react';
import { Users } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

const UsersHeader: React.FC = () => {
  try {
    const { users } = useRBAC();
    
    // Safe access to users array
    const usersCount = Array.isArray(users) ? users.length : 0;

    return (
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-1">
            {usersCount} utilisateur{usersCount !== 1 ? 's' : ''} dans le système
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in UsersHeader:', error);
    return (
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Chargement...</p>
        </div>
      </div>
    );
  }
};

export default UsersHeader;

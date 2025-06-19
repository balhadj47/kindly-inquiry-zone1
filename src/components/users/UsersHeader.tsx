
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

interface UsersHeaderProps {
  onAddUser: () => void;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({ onAddUser }) => {
  try {
    const { hasPermission, users } = useRBAC();
    const canCreateUsers = hasPermission('users:create');
    
    // Safe access to users array
    const usersCount = Array.isArray(users) ? users.length : 0;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        
        {canCreateUsers && (
          <Button onClick={onAddUser} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouvel Utilisateur</span>
          </Button>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in UsersHeader:', error);
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mt-1">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }
};

export default UsersHeader;

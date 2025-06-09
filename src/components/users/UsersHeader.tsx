
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRBAC } from '@/contexts/RBACContext';

interface UsersHeaderProps {
  onAddUser: () => void;
  onAddGroup: () => void;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({ onAddUser, onAddGroup }) => {
  const { hasPermission } = useRBAC();
  const canManageGroups = hasPermission('users.manage_groups');

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
      <div className="flex space-x-2 mt-4 md:mt-0">
        {hasPermission('users.create') && (
          <Button onClick={onAddUser}>
            Ajouter un Nouvel Utilisateur
          </Button>
        )}
        {canManageGroups && (
          <Button variant="outline" onClick={onAddGroup}>
            Ajouter un Groupe
          </Button>
        )}
      </div>
    </div>
  );
};

export default UsersHeader;

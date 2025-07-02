
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthUsersActionsProps {
  onCreateUser: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  canCreateUsers: boolean;
}

const AuthUsersActions: React.FC<AuthUsersActionsProps> = ({
  onCreateUser,
  onRefresh,
  isRefreshing = false,
  canCreateUsers
}) => {
  return (
    <div className="flex items-center gap-3">
      {canCreateUsers && (
        <Button
          onClick={onCreateUser}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Compte
        </Button>
      )}
      
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="bg-blue-600 hover:bg-blue-700 text-white"
        variant="default"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        Actualiser
      </Button>
    </div>
  );
};

export default AuthUsersActions;

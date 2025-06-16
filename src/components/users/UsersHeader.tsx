
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

interface UsersHeaderProps {
  onAddUser: () => void;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({ onAddUser }) => {
  const { hasPermission } = useRBAC();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground">
          Gérez les utilisateurs et leurs permissions dans le système.
        </p>
      </div>
      
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {hasPermission('users:create') && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onAddUser} 
                  size="icon"
                  className="w-12 h-12 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nouvel Utilisateur</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default UsersHeader;

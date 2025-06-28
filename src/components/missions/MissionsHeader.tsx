
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

interface MissionsHeaderProps {
  onAdd: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const MissionsHeader: React.FC<MissionsHeaderProps> = ({ 
  onAdd, 
  onRefresh, 
  isRefreshing = false 
}) => {
  const { hasPermission } = useRBAC();
  
  const canCreateTrips = hasPermission('trips:create');

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Missions</h1>
        <p className="text-gray-600 mt-1">
          Gérez les missions et les voyages
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        )}
        
        {canCreateTrips && (
          <Button 
            onClick={onAdd}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Mission
          </Button>
        )}
      </div>
    </div>
  );
};

export default MissionsHeader;

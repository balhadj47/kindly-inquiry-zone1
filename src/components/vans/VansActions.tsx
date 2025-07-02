
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { Button } from '@/components/ui/button';

interface VansActionsProps {
  onCreateVan: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const VansActions: React.FC<VansActionsProps> = ({
  onCreateVan,
  onRefresh,
  isRefreshing = false
}) => {
  const { canCreateVans } = usePermissionCheck();

  return (
    <div className="flex items-center gap-3">
      {canCreateVans && (
        <Button
          onClick={onCreateVan}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Véhicule
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

export default VansActions;

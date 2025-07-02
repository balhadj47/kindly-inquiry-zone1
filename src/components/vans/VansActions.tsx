
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

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
    <div className="flex items-center gap-2">
      {canCreateVans && (
        <Button
          onClick={onCreateVan}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Véhicule
        </Button>
      )}
      
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        Actualiser
      </Button>
    </div>
  );
};

export default VansActions;

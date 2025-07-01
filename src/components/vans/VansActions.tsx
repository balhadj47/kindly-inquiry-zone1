
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
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="h-9"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
      
      {canCreateVans && (
        <Button
          onClick={onCreateVan}
          size="sm"
          className="h-9"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nouveau Véhicule
        </Button>
      )}
    </div>
  );
};

export default VansActions;

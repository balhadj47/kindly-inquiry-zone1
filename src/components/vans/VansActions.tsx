
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { ActionButton } from '@/components/ui/action-button';

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
      <ActionButton
        onClick={onRefresh}
        icon={RefreshCw}
        variant="outline"
        size="default"
        disabled={isRefreshing}
        loading={isRefreshing}
      >
        Actualiser
      </ActionButton>
      
      {canCreateVans && (
        <ActionButton
          onClick={onCreateVan}
          icon={Plus}
          variant="primary"
          size="default"
        >
          Nouveau Véhicule
        </ActionButton>
      )}
    </div>
  );
};

export default VansActions;

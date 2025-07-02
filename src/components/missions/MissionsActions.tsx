
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { ActionButton } from '@/components/ui/action-button';

interface MissionsActionsProps {
  onCreateMission: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const MissionsActions: React.FC<MissionsActionsProps> = ({
  onCreateMission,
  onRefresh,
  isRefreshing = false
}) => {
  const { canCreateTrips } = useSecurePermissions();

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
      
      {canCreateTrips && (
        <ActionButton
          onClick={onCreateMission}
          icon={Plus}
          variant="primary"
          size="default"
        >
          Nouvelle Mission
        </ActionButton>
      )}
    </div>
  );
};

export default MissionsActions;

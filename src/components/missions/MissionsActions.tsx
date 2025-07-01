
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';

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
      
      {canCreateTrips && (
        <Button
          onClick={onCreateMission}
          size="sm"
          className="h-9"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle Mission
        </Button>
      )}
    </div>
  );
};

export default MissionsActions;

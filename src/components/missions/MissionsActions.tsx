
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { Button } from '@/components/ui/button';

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
      {canCreateTrips && (
        <Button
          onClick={onCreateMission}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Mission
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

export default MissionsActions;

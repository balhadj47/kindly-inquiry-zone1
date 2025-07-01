
import { usePermissions } from '@/hooks/usePermissions';

interface MissionsPermissions {
  canRead: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const useMissionsPermissions = (): MissionsPermissions => {
  const permissions = usePermissions();

  return {
    canRead: permissions.canReadTrips,
    canCreate: permissions.canCreateTrips,
    canEdit: permissions.canUpdateTrips,
    canDelete: permissions.canDeleteTrips
  };
};

import { useSecurePermissions } from '@/hooks/useSecurePermissions';

interface MissionsPermissions {
  canRead: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const useMissionsPermissions = (): MissionsPermissions => {
  const permissions = useSecurePermissions();

  return {
    canRead: permissions.canReadTrips,
    canCreate: permissions.canCreateTrips,
    canEdit: permissions.canUpdateTrips,
    canDelete: permissions.canDeleteTrips
  };
};
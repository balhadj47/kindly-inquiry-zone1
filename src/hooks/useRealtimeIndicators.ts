
import { useState, useEffect } from 'react';
import { useTripsQuery } from './trips/useTripsQuery';
import { useAuthUsers } from './useAuthUsers';
import { useSecurePermissions } from './useSecurePermissions';

interface RealtimeIndicators {
  activeMissions: number;
  pendingApprovals: number;
  systemAlerts: number;
}

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  phone: string | null;
  role: string;
  user_metadata: any;
  banned_until?: string | null;
}

export const useRealtimeIndicators = () => {
  const [indicators, setIndicators] = useState<RealtimeIndicators>({
    activeMissions: 0,
    pendingApprovals: 0,
    systemAlerts: 0
  });

  const { data: tripsData } = useTripsQuery();
  const { data: authUsers = [] } = useAuthUsers();
  const permissions = useSecurePermissions();

  useEffect(() => {
    // Extract trips array from the data structure
    const trips = tripsData?.trips || [];
    
    // Calculate active missions (status: active, in_progress)
    const activeMissions = trips.filter(trip => 
      trip.status === 'active' || trip.status === 'in_progress'
    ).length;

    // Calculate pending approvals (users without email confirmation or banned)
    const pendingApprovals = (authUsers as AuthUser[]).filter(user => 
      !user.email_confirmed_at || user.banned_until
    ).length;

    // Calculate system alerts (basic alerts for now)
    let systemAlerts = 0;
    
    // Alert if there are missions without proper van assignment
    const missionsWithoutVan = trips.filter(trip => 
      (trip.status === 'active' || trip.status === 'in_progress') && !trip.van
    ).length;
    
    // Alert if there are overdue missions (created more than 24 hours ago and still active)
    const overdueMissions = trips.filter(trip => {
      if (trip.status !== 'active') return false;
      const createdAt = new Date(trip.created_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 3600);
      return hoursDiff > 24;
    }).length;

    systemAlerts = missionsWithoutVan + overdueMissions;

    setIndicators({
      activeMissions: permissions.canReadTrips ? activeMissions : 0,
      pendingApprovals: permissions.canReadAuthUsers ? pendingApprovals : 0,
      systemAlerts: permissions.isAdmin ? systemAlerts : 0
    });
  }, [tripsData, authUsers, permissions]);

  return indicators;
};

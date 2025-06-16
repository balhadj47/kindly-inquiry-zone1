
import { Trip } from './types';

export const transformDatabaseTrip = (trip: any): Trip => ({
  id: trip.id,
  van: trip.van,
  driver: trip.driver,
  company: trip.company,
  branch: trip.branch,
  timestamp: trip.created_at,
  notes: trip.notes || '',
  userIds: trip.user_ids || [],
  userRoles: trip.user_roles || [],
  startKm: trip.start_km,
  endKm: trip.end_km,
  status: trip.status || 'active',
});

export const transformDatabaseTrips = (data: any[]): Trip[] => {
  return data.map(transformDatabaseTrip);
};

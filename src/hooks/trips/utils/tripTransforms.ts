
import { Trip } from '@/contexts/TripContext';

export const transformDatabaseToTrip = (databaseTrip: any): Trip => ({
  id: parseInt(databaseTrip.id),
  van: databaseTrip.van || '',
  driver: databaseTrip.driver || '',
  company: databaseTrip.company || '',
  branch: databaseTrip.branch || '',
  startDate: databaseTrip.planned_start_date ? new Date(databaseTrip.planned_start_date) : undefined,
  endDate: databaseTrip.planned_end_date ? new Date(databaseTrip.planned_end_date) : undefined,
  startKm: databaseTrip.start_km || 0,
  endKm: databaseTrip.end_km || null,
  destination: databaseTrip.destination || '',
  notes: databaseTrip.notes || '',
  created_at: databaseTrip.created_at || new Date().toISOString(),
  updated_at: databaseTrip.updated_at || new Date().toISOString(),
  status: databaseTrip.status || 'active',
  userIds: databaseTrip.user_ids || [],
  userRoles: databaseTrip.user_roles || [],
  timestamp: databaseTrip.created_at || new Date().toISOString(),
  companies_data: databaseTrip.companies_data || [],
});

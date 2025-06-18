
import { Trip } from '@/types/trip';

export const transformDatabaseToTrip = (trip: any): Trip => ({
  id: trip.id.toString(),
  van: trip.van || '',
  driver: trip.driver || '',
  company: trip.company || '',
  branch: trip.branch || '',
  start_date: trip.created_at,
  end_date: null,
  start_km: trip.start_km || 0,
  end_km: trip.end_km || null,
  destination: trip.notes || '',
  notes: trip.notes || '',
  company_id: '',
  branch_id: '',
  created_at: trip.created_at,
  updated_at: trip.created_at,
  status: trip.status || 'active',
  user_ids: trip.user_ids || [],
  user_roles: trip.user_roles || [],
});

import { Trip } from '@/contexts/TripContext';

export const transformTripsToContextFormat = (trips: any[]): Trip[] => {
  return trips.map((trip: any): Trip => ({
    id: trip.id,
    van: trip.van || '',
    driver: trip.driver || '',
    company: trip.company || '',
    branch: trip.branch || '',
    timestamp: trip.created_at || new Date().toISOString(),
    notes: trip.notes || '',
    userIds: trip.user_ids || [],
    userRoles: trip.user_roles || [],
    startKm: trip.start_km || 0,
    endKm: trip.end_km || null,
    status: trip.status || 'active',
    startDate: trip.planned_start_date ? new Date(trip.planned_start_date) : undefined,
    endDate: trip.planned_end_date ? new Date(trip.planned_end_date) : undefined,
    destination: trip.destination || '',
    distance: trip.distance || undefined,
    planned_start_date: trip.planned_start_date,
    planned_end_date: trip.planned_end_date,
    start_km: trip.start_km,
    end_km: trip.end_km,
    created_at: trip.created_at,
    updated_at: trip.updated_at,
    companies_data: trip.companies_data || []
  }));
};
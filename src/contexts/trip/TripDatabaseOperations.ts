
import { supabase } from '@/integrations/supabase/client';
import { Trip, UserWithRoles } from './types';

export const fetchTripsFromDatabase = async () => {
  const { data, error } = await (supabase as any)
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Trips error:', error);
    throw error;
  }

  console.log('Fetched trips:', data);
  return data || [];
};

export const insertTripToDatabase = async (tripData: {
  van: string;
  driver: string;
  company: string;
  branch: string;
  notes: string;
  userIds: string[];
  userRoles: UserWithRoles[];
  startKm?: number;
  startDate?: Date;
  endDate?: Date;
}) => {
  const { data, error } = await (supabase as any)
    .from('trips')
    .insert({
      van: tripData.van,
      driver: tripData.driver,
      company: tripData.company,
      branch: tripData.branch,
      notes: tripData.notes,
      user_ids: tripData.userIds,
      user_roles: tripData.userRoles || [],
      start_km: tripData.startKm,
      start_date: tripData.startDate?.toISOString(),
      end_date: tripData.endDate?.toISOString(),
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Insert trip error:', error);
    throw error;
  }

  console.log('Trip added successfully:', data);
  return data;
};

export const updateTripInDatabase = async (tripId: number, endKm: number) => {
  const { error } = await (supabase as any)
    .from('trips')
    .update({
      end_km: endKm,
      status: 'completed'
    })
    .eq('id', tripId);

  if (error) {
    console.error('End trip error:', error);
    throw error;
  }

  console.log('Trip ended successfully:', tripId);
};

export const deleteTripFromDatabase = async (tripId: number) => {
  const { error } = await (supabase as any)
    .from('trips')
    .delete()
    .eq('id', tripId);

  if (error) {
    console.error('Delete trip error:', error);
    throw error;
  }

  console.log('Trip deleted successfully:', tripId);
};

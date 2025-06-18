import { supabase } from '@/integrations/supabase/client';
import { Trip, UserWithRoles } from './types';
import { getTripCache, isTripCacheValid, setTripCache, getTripFetchPromise, setTripFetchPromise } from './TripCacheManager';

export const fetchTripsFromDatabase = async (useCache = true, limit?: number, offset?: number) => {
  try {
    console.log('🚗 Starting to fetch trips data...');
    const startTime = performance.now();
    
    // Check cache first (only for full data requests)
    if (useCache && !limit && !offset && isTripCacheValid()) {
      const cache = getTripCache();
      if (cache) {
        console.log('🚗 Using cached trips data');
        return cache.data;
      }
    }

    // If there's already a fetch in progress, wait for it (only for full data requests)
    if (!limit && !offset) {
      const existingPromise = getTripFetchPromise();
      if (existingPromise) {
        console.log('🚗 Waiting for existing trips fetch...');
        return await existingPromise;
      }
    }

    // Start new fetch with optimized query
    const fetchPromise = (async () => {
      let query = (supabase as any)
        .from('trips')
        .select(`
          id,
          van,
          driver,
          company,
          branch,
          created_at,
          notes,
          user_ids,
          user_roles,
          start_km,
          end_km,
          status,
          planned_start_date,
          planned_end_date
        `)
        .order('created_at', { ascending: false });

      // Add pagination if specified
      if (limit) {
        query = query.limit(limit);
        if (offset) {
          query = query.range(offset, offset + limit - 1);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Trips error:', error);
        throw error;
      }

      const tripsData = data || [];
      
      // Update cache only for full data requests
      if (!limit && !offset) {
        setTripCache(tripsData);
      }
      
      console.log('🚗 Successfully fetched trips data in:', performance.now() - startTime, 'ms');
      return tripsData;
    })();

    // Only track promise for full data requests
    if (!limit && !offset) {
      setTripFetchPromise(fetchPromise);
    }
    
    try {
      const result = await fetchPromise;
      return result;
    } finally {
      if (!limit && !offset) {
        setTripFetchPromise(null);
      }
    }
  } catch (error) {
    console.error('🚗 Error fetching trips:', error);
    if (!limit && !offset) {
      setTripFetchPromise(null);
    }
    throw error;
  }
};

export const fetchTripsCount = async () => {
  try {
    const { count, error } = await (supabase as any)
      .from('trips')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching trips count:', error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Error fetching trips count:', error);
    throw error;
  }
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
  console.log('Inserting trip with planned dates:', {
    startDate: tripData.startDate,
    endDate: tripData.endDate
  });

  // Start a transaction to update both trip and van status
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
      planned_start_date: tripData.startDate?.toISOString(),
      planned_end_date: tripData.endDate?.toISOString(),
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Insert trip error:', error);
    throw error;
  }

  // Update van status to "En Transit"
  const { error: vanError } = await (supabase as any)
    .from('vans')
    .update({ status: 'En Transit' })
    .eq('id', tripData.van);

  if (vanError) {
    console.error('Update van status error:', vanError);
    // Don't throw here, trip was created successfully
  }

  console.log('Trip added successfully and van status updated:', data);
  
  // Clear cache to force refresh on next load
  const { clearTripCache } = await import('./TripCacheManager');
  clearTripCache();
  
  return data;
};

export const updateTripInDatabase = async (tripId: number, endKm: number) => {
  // First get the trip to find the van ID
  const { data: tripData, error: tripError } = await (supabase as any)
    .from('trips')
    .select('van')
    .eq('id', tripId)
    .single();

  if (tripError) {
    console.error('Get trip error:', tripError);
    throw tripError;
  }

  // Update trip status
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

  // Update van status back to "Active"
  if (tripData?.van) {
    const { error: vanError } = await (supabase as any)
      .from('vans')
      .update({ status: 'Active' })
      .eq('id', tripData.van);

    if (vanError) {
      console.error('Update van status error:', vanError);
      // Don't throw here, trip was updated successfully
    }
  }

  console.log('Trip ended successfully and van status updated:', tripId);
  
  // Clear cache to force refresh on next load
  const { clearTripCache } = await import('./TripCacheManager');
  clearTripCache();
};

export const deleteTripFromDatabase = async (tripId: number) => {
  // First get the trip to find the van ID
  const { data: tripData, error: tripError } = await (supabase as any)
    .from('trips')
    .select('van, status')
    .eq('id', tripId)
    .single();

  if (tripError) {
    console.error('Get trip error:', tripError);
    throw tripError;
  }

  // Delete the trip
  const { error } = await (supabase as any)
    .from('trips')
    .delete()
    .eq('id', tripId);

  if (error) {
    console.error('Delete trip error:', error);
    throw error;
  }

  // If the trip was active, update van status back to "Active"
  if (tripData?.van && tripData?.status === 'active') {
    const { error: vanError } = await (supabase as any)
      .from('vans')
      .update({ status: 'Active' })
      .eq('id', tripData.van);

    if (vanError) {
      console.error('Update van status error:', vanError);
      // Don't throw here, trip was deleted successfully
    }
  }

  console.log('Trip deleted successfully and van status updated:', tripId);
  
  // Clear cache to force refresh on next load
  const { clearTripCache } = await import('./TripCacheManager');
  clearTripCache();
};

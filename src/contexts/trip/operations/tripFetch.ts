
import { supabase, requireAuth } from '@/integrations/supabase/client';
import { getTripCache, isTripCacheValid, setTripCache, getTripFetchPromise, setTripFetchPromise } from '../TripCacheManager';

export const fetchTripsFromDatabase = async (useCache = true, limit?: number, offset?: number) => {
  try {
    console.log('🚗 Starting to fetch trips data...');
    const startTime = performance.now();
    
    // Require authentication for all trip data access
    await requireAuth();
    
    // Check cache first (only for full data requests)
    if (useCache && !limit && !offset && isTripCacheValid()) {
      const cached = getTripCache();
      if (cached) {
        console.log('🚗 Using cached trips data');
        return cached;
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
          planned_end_date,
          companies_data,
          trip_companies (
            id,
            company_id,
            branch_id
          )
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
    // Require authentication
    await requireAuth();
    
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

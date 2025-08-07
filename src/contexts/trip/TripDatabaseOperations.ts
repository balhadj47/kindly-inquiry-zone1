import { supabase, requireAuth } from '@/integrations/supabase/client';
import { Trip, UserWithRoles } from './types';
import { CompanyBranchSelection } from '@/types/company-selection';
import { getTripCache, isTripCacheValid, setTripCache, getTripFetchPromise, setTripFetchPromise } from './TripCacheManager';

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
  selectedCompanies?: CompanyBranchSelection[];
}) => {
  // Require authentication
  await requireAuth();
  
  console.log('Inserting trip with companies:', tripData.selectedCompanies);
  console.log('Full tripData received in insertTripToDatabase:', JSON.stringify(tripData, null, 2));

  try {
    // Prepare companies_data for storage
    const companiesData = tripData.selectedCompanies || [];
    console.log('Companies data being saved:', companiesData);

    // Start a transaction to insert trip and company relationships
    const { data: tripResult, error: tripError } = await (supabase as any)
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
        companies_data: companiesData, // Store multiple companies here
      })
      .select()
      .single();

    if (tripError) {
      console.error('Insert trip error:', tripError);
      throw tripError;
    }

    console.log('Trip inserted successfully with companies_data:', tripResult);

    // Insert company relationships if provided
    if (tripData.selectedCompanies && tripData.selectedCompanies.length > 0) {
      console.log('Inserting trip companies relationships:', tripData.selectedCompanies.length, 'companies');
      const companyRelationships = tripData.selectedCompanies.map(company => ({
        trip_id: tripResult.id,
        company_id: company.companyId,
        branch_id: company.branchId
      }));

      console.log('Company relationships to insert:', companyRelationships);

      const { data: insertedRelationships, error: companiesError } = await (supabase as any)
        .from('trip_companies')
        .insert(companyRelationships)
        .select();

      if (companiesError) {
        console.error('Insert trip companies error:', companiesError);
        // Don't throw here, trip was created successfully
        console.error('Failed to insert company relationships, but trip was created');
      } else {
        console.log('Trip companies inserted successfully:', insertedRelationships);
      }
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

    console.log('Trip and companies added successfully, van status updated');
    
    // Clear cache to force refresh on next load
    const { clearTripCache } = await import('./TripCacheManager');
    clearTripCache();
    
    return tripResult;
  } catch (error) {
    console.error('Error in insertTripToDatabase:', error);
    throw error;
  }
};

export const updateTripInDatabase = async (tripId: number, endKm: number) => {
  // Require authentication
  await requireAuth();
  
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
  // Require authentication
  await requireAuth();
  
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

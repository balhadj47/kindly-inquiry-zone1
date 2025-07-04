
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Van } from '@/types/van';
import { useSelectiveDataUpdate } from './useSelectiveDataUpdate';

export const useVans = () => {
  const [vans, setVans] = useState<Van[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Changed: Start with false, only set true during actual fetching
  const isMountedRef = useRef(true);
  const fetchingRef = useRef(false);
  const hasInitialLoadRef = useRef(false); // Track if we've loaded data at least once
  const { compareAndUpdate } = useSelectiveDataUpdate<Van>();

  const fetchVans = useCallback(async (forceRefresh = false): Promise<Van[]> => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef.current && !forceRefresh) {
      console.log('🚐 useVans: Fetch already in progress, returning current data');
      return vans;
    }

    try {
      fetchingRef.current = true;
      
      // Only show loading if we don't have initial data yet
      if (isMountedRef.current && !hasInitialLoadRef.current) {
        setIsLoading(true);
      }
      
      setError(null);

      console.log('🚐 useVans: Fetching fresh data from database...');
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('vans')
        .select(`
          id,
          license_plate,
          model,
          reference_code,
          driver_id,
          status,
          created_at,
          insurer,
          insurance_date,
          control_date,
          notes
        `)
        .order('license_plate');

      if (error) {
        console.error('🚐 useVans: Database error:', error);
        throw error;
      }

      // Transform data to match Van interface, adding updated_at as fallback
      const vansData = (data || []).map(van => ({
        ...van,
        updated_at: van.created_at // Use created_at as fallback for updated_at
      })) as Van[];
      
      const endTime = performance.now();
      console.log('🚐 useVans: Fresh fetch completed -', vansData.length, 'vans in', endTime - startTime, 'ms');
      
      // Update state only if component is still mounted
      if (isMountedRef.current) {
        // Use selective update to only change what's different
        if (vans.length > 0 && !forceRefresh) {
          compareAndUpdate(vans, vansData, setVans);
        } else {
          // First load or force refresh - set all data
          setVans(vansData);
        }
        setError(null);
        hasInitialLoadRef.current = true; // Mark that we've loaded data
        setIsLoading(false);
      }
      
      return vansData;
    } catch (err) {
      console.error('🚐 useVans: Error:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
      throw err;
    } finally {
      fetchingRef.current = false;
    }
  }, [vans, compareAndUpdate]);

  // Force refresh function - always gets fresh data
  const refetch = useCallback(async () => {
    console.log('🚐 useVans: Manual refetch requested');
    return await fetchVans(true);
  }, [fetchVans]);

  // Selective refresh function - compares and updates only changed data
  const refreshChanges = useCallback(async () => {
    console.log('🚐 useVans: Selective refresh requested');
    return await fetchVans(false);
  }, [fetchVans]);

  useEffect(() => {
    console.log('🚐 useVans: Component mounted');
    isMountedRef.current = true;
    
    // Fetch data on mount
    fetchVans(true);
    
    return () => {
      console.log('🚐 useVans: Component unmounting');
      isMountedRef.current = false;
    };
  }, []); // Remove fetchVans dependency to prevent re-running

  return { vans, error, refetch, refreshChanges, isLoading };
};

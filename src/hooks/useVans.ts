
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Van {
  id: string;
  license_plate: string;
  model: string;
  reference_code: string;
  driver_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  insurer?: string;
  insurance_date?: string;
  control_date?: string;
  notes?: string;
}

export const useVans = () => {
  const [vans, setVans] = useState<Van[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  const fetchingRef = useRef(false);

  const fetchVans = useCallback(async (forceRefresh = false): Promise<Van[]> => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef.current && !forceRefresh) {
      console.log('🚐 useVans: Fetch already in progress, returning current data');
      return vans;
    }

    try {
      fetchingRef.current = true;
      
      if (isMountedRef.current) {
        setIsLoading(true);
        setError(null);
      }

      console.log('🚐 useVans: Fetching fresh data from database...');
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('vans')
        .select('*')
        .order('license_plate');

      if (error) {
        console.error('🚐 useVans: Database error:', error);
        throw error;
      }

      const vansData = data || [];
      const endTime = performance.now();
      console.log('🚐 useVans: Fresh fetch completed -', vansData.length, 'vans in', endTime - startTime, 'ms');
      
      // Update state only if component is still mounted
      if (isMountedRef.current) {
        setVans(vansData);
        setError(null);
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
  }, [vans]);

  // Force refresh function - always gets fresh data
  const refetch = useCallback(async () => {
    console.log('🚐 useVans: Manual refetch requested');
    return await fetchVans(true);
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

  return { vans, error, refetch, isLoading };
};

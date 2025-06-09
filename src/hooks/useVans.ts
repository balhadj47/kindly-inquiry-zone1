
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Van {
  id: string;
  license_plate: string;
  model: string;
  driver_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useVans = () => {
  const [vans, setVans] = useState<Van[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVans = useCallback(async () => {
    try {
      console.log('🚐 useVans: Starting to fetch vans data...');
      setLoading(true);
      
      const { data, error } = await (supabase as any)
        .from('vans')
        .select('*');

      if (error) {
        console.error('🚐 useVans: Supabase error:', error);
        throw error;
      }

      console.log('🚐 useVans: Successfully fetched vans data:', data);
      setVans(data || []);
    } catch (err) {
      console.error('🚐 useVans: Error fetching vans:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      console.log('🚐 useVans: Finished fetching vans data');
    }
  }, []);

  useEffect(() => {
    console.log('🚐 useVans: useEffect triggered - component mounted or fetchVans changed');
    fetchVans();
    
    return () => {
      console.log('🚐 useVans: Cleanup - component unmounting');
    };
  }, [fetchVans]);

  return { vans, loading, error, refetch: fetchVans };
};

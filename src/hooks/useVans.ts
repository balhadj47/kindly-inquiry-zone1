
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
      setLoading(true);
      
      const { data, error } = await (supabase as any)
        .from('vans')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched vans data:', data);
      setVans(data || []);
    } catch (err) {
      console.error('Error fetching vans:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVans();
  }, [fetchVans]);

  return { vans, loading, error, refetch: fetchVans };
};

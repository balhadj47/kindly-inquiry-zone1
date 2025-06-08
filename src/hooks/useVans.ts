
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Van {
  id: string;
  license_plate: string;
  model: string;
  driver_id: string;
}

export const useVans = () => {
  const [vans, setVans] = useState<Van[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVans = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('vans')
          .select('*');

        if (error) throw error;

        setVans(data || []);
      } catch (err) {
        console.error('Error fetching vans:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVans();
  }, []);

  return { vans, loading, error };
};


import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/contexts/TripContext';
import { transformTripsToContextFormat } from '@/utils/tripDataTransformer';

export const useMissionsData = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trips:', error);
        throw error;
      }

      return data;
    },
    select: (data) => {
      return transformTripsToContextFormat(data);
    },
  });
};

export const useFilteredMissions = (tripsData: Trip[] | undefined, searchTerm: string, statusFilter: string) => {
  return useMemo(() => {
    if (!tripsData) return [];

    let filtered = [...tripsData];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(mission =>
        mission.company?.toLowerCase().includes(term) ||
        mission.branch?.toLowerCase().includes(term) ||
        mission.driver?.toLowerCase().includes(term) ||
        mission.van?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(mission => mission.status === statusFilter);
    }

    return filtered;
  }, [tripsData, searchTerm, statusFilter]);
};

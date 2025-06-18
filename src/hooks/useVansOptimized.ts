
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

// Base hook for all vans
export const useVans = () => {
  return useQuery({
    queryKey: ['vans'],
    queryFn: async (): Promise<Van[]> => {
      console.log('🚐 useVansOptimized: Fetching all vans...');
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('vans')
        .select('*')
        .order('license_plate');

      if (error) {
        console.error('🚐 useVansOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚐 useVansOptimized: Fetched in:', endTime - startTime, 'ms');
      
      // Transform data to ensure all required fields are present
      return (data || []).map(van => ({
        ...van,
        updated_at: van.created_at, // Use created_at as fallback for updated_at if not present
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for available vans (not in active missions)
export const useAvailableVans = () => {
  return useQuery({
    queryKey: ['vans', 'available'],
    queryFn: async (): Promise<Van[]> => {
      console.log('🚐 useVansOptimized: Fetching available vans...');
      const startTime = performance.now();
      
      // Get vans that are not currently in active trips
      const { data: activeTrips, error: tripsError } = await supabase
        .from('trips')
        .select('van')
        .is('end_date', null);

      if (tripsError) {
        console.error('🚐 useVansOptimized: Error fetching active trips:', tripsError);
        // Continue without filtering if trips query fails
      }

      const activeVanIds = activeTrips?.map(trip => trip.van) || [];

      let query = supabase
        .from('vans')
        .select('*')
        .eq('status', 'Active')
        .order('license_plate');

      // Only apply filter if we have active van IDs
      if (activeVanIds.length > 0) {
        query = query.not('id', 'in', `(${activeVanIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('🚐 useVansOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚐 useVansOptimized: Fetched available vans in:', endTime - startTime, 'ms');
      
      // Transform data to ensure all required fields are present
      return (data || []).map(van => ({
        ...van,
        updated_at: van.created_at, // Use created_at as fallback for updated_at if not present
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for availability)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for a single van
export const useVan = (vanId: string | null) => {
  return useQuery({
    queryKey: ['vans', vanId],
    queryFn: async (): Promise<Van | null> => {
      if (!vanId) return null;
      
      console.log('🚐 useVansOptimized: Fetching van:', vanId);
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('vans')
        .select('*')
        .eq('id', vanId)
        .single();

      if (error) {
        console.error('🚐 useVansOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚐 useVansOptimized: Fetched van in:', endTime - startTime, 'ms');
      
      // Transform data to ensure all required fields are present
      return {
        ...data,
        updated_at: data.created_at, // Use created_at as fallback for updated_at if not present
      };
    },
    enabled: !!vanId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutations for van operations
export const useVanMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateVans = () => {
    queryClient.invalidateQueries({ queryKey: ['vans'] });
  };

  const createVan = useMutation({
    mutationFn: async (vanData: Partial<Van>) => {
      const { data, error } = await supabase
        .from('vans')
        .insert([{
          license_plate: vanData.license_plate || '',
          model: vanData.model || '',
          reference_code: vanData.reference_code || '',
          status: vanData.status || 'Active',
          insurer: vanData.insurer,
          insurance_date: vanData.insurance_date,
          control_date: vanData.control_date,
          notes: vanData.notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateVans();
      toast({
        title: 'Succès',
        description: 'Camionnette créée avec succès',
      });
    },
    onError: (error) => {
      console.error('Error creating van:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la camionnette',
        variant: 'destructive',
      });
    },
  });

  const updateVan = useMutation({
    mutationFn: async ({ id, ...vanData }: Partial<Van> & { id: string }) => {
      const { data, error } = await supabase
        .from('vans')
        .update({
          license_plate: vanData.license_plate,
          model: vanData.model,
          reference_code: vanData.reference_code,
          status: vanData.status,
          insurer: vanData.insurer,
          insurance_date: vanData.insurance_date,
          control_date: vanData.control_date,
          notes: vanData.notes,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateVans();
      toast({
        title: 'Succès',
        description: 'Camionnette modifiée avec succès',
      });
    },
    onError: (error) => {
      console.error('Error updating van:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la camionnette',
        variant: 'destructive',
      });
    },
  });

  const deleteVan = useMutation({
    mutationFn: async (vanId: string) => {
      const { error } = await supabase
        .from('vans')
        .delete()
        .eq('id', vanId);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateVans();
      toast({
        title: 'Succès',
        description: 'Camionnette supprimée avec succès',
      });
    },
    onError: (error) => {
      console.error('Error deleting van:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la camionnette',
        variant: 'destructive',
      });
    },
  });

  return {
    createVan,
    updateVan,
    deleteVan,
    invalidateVans,
  };
};

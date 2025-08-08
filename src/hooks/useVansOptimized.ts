
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Van } from '@/types/van';
import { useToast } from '@/hooks/use-toast';

const VANS_QUERY_KEY = ['vans'];

export const useAllVans = () => {
  return useQuery({
    queryKey: VANS_QUERY_KEY,
    queryFn: async (): Promise<Van[]> => {
      console.log('🚐 useVansOptimized: Fetching FRESH data from database...');
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
        console.error('🚐 useVansOptimized: Database error:', error);
        throw error;
      }

      // Transform data to match Van interface, adding updated_at as fallback
      const vansData = (data || []).map(van => ({
        ...van,
        updated_at: van.created_at // Use created_at as fallback for updated_at
      })) as Van[];
      
      const endTime = performance.now();
      console.log('🚐 useVansOptimized: Fetch completed -', vansData.length, 'vans in', endTime - startTime, 'ms');
      console.log('🚐 DETAILED van statuses:', vansData.map(v => ({ 
        id: v.id, 
        license_plate: v.license_plate, 
        status: v.status,
        reference_code: v.reference_code
      })));
      
      return vansData;
    },
    staleTime: 3000, // 3 seconds for real-time sync
    gcTime: 30000, // Keep in cache for 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

// Export useVans as an alias for backward compatibility
export const useVans = useAllVans;

// Export useAvailableVans for van selector - only show truly available vans
export const useAvailableVans = () => {
  const { data: allVans = [], ...rest } = useAllVans();
  
  // Filter to only available vans - check for "Actif" status specifically
  const availableVans = allVans.filter(van => {
    const isAvailable = van.status === 'Actif' || van.status === 'Active';
    console.log(`🚐 Van ${van.license_plate} (${van.id}): status="${van.status}", available=${isAvailable}`);
    return isAvailable;
  });
  
  console.log('🚐 AVAILABLE vans after filtering:', availableVans.map(v => ({ 
    id: v.id, 
    license_plate: v.license_plate, 
    status: v.status 
  })));
  
  console.log('🚐 UNAVAILABLE vans:', allVans.filter(v => v.status !== 'Actif' && v.status !== 'Active').map(v => ({ 
    id: v.id, 
    license_plate: v.license_plate, 
    status: v.status 
  })));
  
  return {
    data: availableVans,
    ...rest
  };
};

export const useVanMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateVans = () => {
    console.log('🚐 Invalidating vans cache...');
    queryClient.removeQueries({ queryKey: VANS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: VANS_QUERY_KEY });
  };

  const refreshVans = () => {
    console.log('🚐 Force refreshing vans data...');
    queryClient.removeQueries({ queryKey: VANS_QUERY_KEY });
    queryClient.refetchQueries({ queryKey: VANS_QUERY_KEY });
  };

  const createVan = useMutation({
    mutationFn: async (vanData: {
      license_plate: string;
      model: string;
      reference_code?: string;
      driver_id?: string | null;
      status?: string;
      insurer?: string;
      insurance_date?: string;
      control_date?: string;
      notes?: string;
    }) => {
      // Ensure reference_code has a value
      const dataToInsert = {
        ...vanData,
        reference_code: vanData.reference_code || vanData.license_plate || 'AUTO',
      };
      
      const { data, error } = await supabase
        .from('vans')
        .insert(dataToInsert)
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
        description: 'Erreur lors de la création de la camionnette',
        variant: 'destructive',
      });
    },
  });

  const updateVan = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Van> & { id: string }) => {
      const { data, error } = await supabase
        .from('vans')
        .update(updateData)
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
        description: 'Camionnette mise à jour avec succès',
      });
    },
    onError: (error) => {
      console.error('Error updating van:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour de la camionnette',
        variant: 'destructive',
      });
    },
  });

  const deleteVan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vans')
        .delete()
        .eq('id', id);

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
        description: 'Erreur lors de la suppression de la camionnette',
        variant: 'destructive',
      });
    },
  });

  return {
    createVan,
    updateVan,
    deleteVan,
    invalidateVans,
    refreshVans,
  };
};

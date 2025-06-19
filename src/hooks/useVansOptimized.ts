
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Van } from '@/types/van';
import { useToast } from '@/hooks/use-toast';

const VANS_QUERY_KEY = ['vans'];

export const useAllVans = () => {
  return useQuery({
    queryKey: VANS_QUERY_KEY,
    queryFn: async (): Promise<Van[]> => {
      console.log('🚐 useVansOptimized: Fetching fresh data from database...');
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
      console.log('🚐 useVansOptimized: Fresh fetch completed -', vansData.length, 'vans in', endTime - startTime, 'ms');
      
      return vansData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });
};

export const useVanMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateVans = () => {
    queryClient.invalidateQueries({ queryKey: VANS_QUERY_KEY });
  };

  const createVan = useMutation({
    mutationFn: async (vanData: Partial<Van>) => {
      const { data, error } = await supabase
        .from('vans')
        .insert([vanData])
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
  };
};

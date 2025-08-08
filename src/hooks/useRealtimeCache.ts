import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeCache = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔄 Setting up real-time cache invalidation...');
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips'
        },
        (payload) => {
          console.log('🚗 Real-time trips change:', payload);
          queryClient.invalidateQueries({ queryKey: ['trips'] });
          queryClient.invalidateQueries({ queryKey: ['vans'] });
          
          // Show user feedback for important changes
          if (payload.eventType === 'UPDATE' && payload.new?.status === 'completed') {
            toast({
              title: "Mission terminée",
              description: "Les données ont été mises à jour automatiquement",
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vans'
        },
        (payload) => {
          console.log('🚐 Real-time vans change:', payload);
          queryClient.invalidateQueries({ queryKey: ['vans'] });
          queryClient.invalidateQueries({ queryKey: ['available-vans'] });
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up real-time cache subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return {
    invalidateTrips: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    invalidateVans: () => {
      queryClient.invalidateQueries({ queryKey: ['vans'] });
      queryClient.invalidateQueries({ queryKey: ['available-vans'] });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['vans'] });
      queryClient.invalidateQueries({ queryKey: ['available-vans'] });
    }
  };
};
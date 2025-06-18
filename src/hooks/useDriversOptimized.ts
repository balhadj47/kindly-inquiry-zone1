
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: string;
  systemGroup: string;
  totalTrips?: number;
  lastTrip?: string;
  created_at?: string;
  updated_at?: string;
}

// Base hook for all drivers
export const useDrivers = () => {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: async (): Promise<Driver[]> => {
      console.log('👨‍💼 useDriversOptimized: Fetching all drivers...');
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('system_group', '%chauffeur%')
        .not('license_number', 'is', null)
        .order('name');

      if (error) {
        console.error('👨‍💼 useDriversOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('👨‍💼 useDriversOptimized: Fetched in:', endTime - startTime, 'ms');
      
      // Transform data to match Driver interface
      return (data || []).map(user => ({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        licenseNumber: user.license_number || '',
        status: user.status || 'Active',
        systemGroup: user.system_group || '',
        totalTrips: 0, // Will be calculated separately if needed
        lastTrip: null, // Will be calculated separately if needed
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for available drivers (not in active missions)
export const useAvailableDrivers = () => {
  return useQuery({
    queryKey: ['drivers', 'available'],
    queryFn: async (): Promise<Driver[]> => {
      console.log('👨‍💼 useDriversOptimized: Fetching available drivers...');
      const startTime = performance.now();
      
      // Get drivers that are not currently in active trips
      const { data: activeTrips, error: tripsError } = await supabase
        .from('trip_users')
        .select('user_id')
        .eq('role', 'Chauffeur')
        .in('trip_id', 
          supabase
            .from('trips')
            .select('id')
            .is('end_date', null)
        );

      if (tripsError) {
        console.error('👨‍💼 useDriversOptimized: Error fetching active trips:', tripsError);
        throw tripsError;
      }

      const activeDriverIds = activeTrips?.map(trip => trip.user_id) || [];

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('system_group', '%chauffeur%')
        .not('license_number', 'is', null)
        .not('id', 'in', `(${activeDriverIds.join(',')})`)
        .eq('status', 'Active')
        .order('name');

      if (error) {
        console.error('👨‍💼 useDriversOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('👨‍💼 useDriversOptimized: Fetched available drivers in:', endTime - startTime, 'ms');
      
      return (data || []).map(user => ({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        licenseNumber: user.license_number || '',
        status: user.status || 'Active',
        systemGroup: user.system_group || '',
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for availability)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for a single driver with trip statistics
export const useDriverWithStats = (driverId: string | null) => {
  return useQuery({
    queryKey: ['drivers', driverId, 'stats'],
    queryFn: async (): Promise<Driver | null> => {
      if (!driverId) return null;
      
      console.log('👨‍💼 useDriversOptimized: Fetching driver with stats:', driverId);
      const startTime = performance.now();
      
      // Get driver info
      const { data: driver, error: driverError } = await supabase
        .from('users')
        .select('*')
        .eq('id', driverId)
        .single();

      if (driverError) {
        console.error('👨‍💼 useDriversOptimized: Error:', driverError);
        throw driverError;
      }

      // Get trip statistics
      const { data: tripStats, error: statsError } = await supabase
        .from('trip_users')
        .select('trip_id, trips!inner(*)')
        .eq('user_id', driverId)
        .eq('role', 'Chauffeur');

      if (statsError) {
        console.error('👨‍💼 useDriversOptimized: Error fetching stats:', statsError);
      }

      const totalTrips = tripStats?.length || 0;
      const lastTrip = tripStats && tripStats.length > 0 
        ? new Date(Math.max(...tripStats.map(t => new Date(t.trips.created_at).getTime())))
            .toLocaleDateString('fr-FR')
        : null;

      const endTime = performance.now();
      console.log('👨‍💼 useDriversOptimized: Fetched driver with stats in:', endTime - startTime, 'ms');
      
      return {
        id: driver.id,
        name: driver.name || '',
        email: driver.email || '',
        phone: driver.phone || '',
        licenseNumber: driver.license_number || '',
        status: driver.status || 'Active',
        systemGroup: driver.system_group || '',
        totalTrips,
        lastTrip,
      };
    },
    enabled: !!driverId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutations for driver operations
export const useDriverMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateDrivers = () => {
    queryClient.invalidateQueries({ queryKey: ['drivers'] });
  };

  const updateDriver = useMutation({
    mutationFn: async ({ id, ...driverData }: Partial<Driver> & { id: string }) => {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: driverData.name,
          email: driverData.email,
          phone: driverData.phone,
          license_number: driverData.licenseNumber,
          status: driverData.status,
          system_group: driverData.systemGroup,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateDrivers();
      toast({
        title: 'Succès',
        description: 'Chauffeur modifié avec succès',
      });
    },
    onError: (error) => {
      console.error('Error updating driver:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le chauffeur',
        variant: 'destructive',
      });
    },
  });

  return {
    updateDriver,
    invalidateDrivers,
  };
};

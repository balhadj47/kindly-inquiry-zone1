
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getRoleNameFromId } from '@/utils/roleUtils';

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
        .not('role_id', 'is', null)
        .order('name');

      if (error) {
        console.error('👨‍💼 useDriversOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('👨‍💼 useDriversOptimized: Fetched in:', endTime - startTime, 'ms');
      
      // Transform data to match Driver interface with async role names
      const drivers = await Promise.all((data || []).map(async (user) => {
        const roleName = await getRoleNameFromId(user.role_id || 3);
        return {
          id: user.id.toString(),
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          licenseNumber: user.driver_license || '',
          status: user.status || 'Active',
          systemGroup: roleName,
          totalTrips: user.total_trips || 0,
          lastTrip: user.last_trip || null,
          created_at: user.created_at,
        };
      }));

      return drivers;
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
      
      // Get all drivers first, then filter based on active trips
      const { data: allDrivers, error: driversError } = await supabase
        .from('users')
        .select('*')
        .not('role_id', 'is', null)
        .eq('status', 'Active')
        .order('name');

      if (driversError) {
        console.error('👨‍💼 useDriversOptimized: Error:', driversError);
        throw driversError;
      }

      // Get active trips to filter out busy drivers
      const { data: activeTrips, error: tripsError } = await supabase
        .from('trips')
        .select('id')
        .is('end_date', null);

      if (tripsError) {
        console.error('👨‍💼 useDriversOptimized: Error fetching active trips:', tripsError);
        // Continue without filtering if trips query fails
      }

      const endTime = performance.now();
      console.log('👨‍💼 useDriversOptimized: Fetched available drivers in:', endTime - startTime, 'ms');
      
      // Transform data with async role names
      const drivers = await Promise.all((allDrivers || []).map(async (user) => {
        const roleName = await getRoleNameFromId(user.role_id || 3);
        return {
          id: user.id.toString(),
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          licenseNumber: user.driver_license || '',
          status: user.status || 'Active',
          systemGroup: roleName,
          totalTrips: user.total_trips || 0,
          lastTrip: user.last_trip || null,
        };
      }));

      return drivers;
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
      
      // Convert string ID to number for database query
      const numericId = parseInt(driverId, 10);
      
      // Get driver info
      const { data: driver, error: driverError } = await supabase
        .from('users')
        .select('*')
        .eq('id', numericId)
        .single();

      if (driverError) {
        console.error('👨‍💼 useDriversOptimized: Error:', driverError);
        throw driverError;
      }

      const endTime = performance.now();
      console.log('👨‍💼 useDriversOptimized: Fetched driver with stats in:', endTime - startTime, 'ms');
      
      const roleName = await getRoleNameFromId(driver.role_id || 3);
      
      return {
        id: driver.id.toString(),
        name: driver.name || '',
        email: driver.email || '',
        phone: driver.phone || '',
        licenseNumber: driver.driver_license || '',
        status: driver.status || 'Active',
        systemGroup: roleName,
        totalTrips: driver.total_trips || 0,
        lastTrip: driver.last_trip || null,
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
      // Convert string ID to number for database query
      const numericId = parseInt(id, 10);
      
      const { data, error } = await supabase
        .from('users')
        .update({
          name: driverData.name,
          email: driverData.email,
          phone: driverData.phone,
          status: driverData.status,
          role_id: driverData.systemGroup === 'Administrator' ? 1 : 
                   driverData.systemGroup === 'Supervisor' ? 2 : 3,
        })
        .eq('id', numericId)
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

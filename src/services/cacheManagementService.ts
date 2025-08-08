import { QueryClient } from '@tanstack/react-query';

export class CacheManagementService {
  private static instance: CacheManagementService;
  private queryClient: QueryClient;

  private constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  static getInstance(queryClient: QueryClient): CacheManagementService {
    if (!CacheManagementService.instance) {
      CacheManagementService.instance = new CacheManagementService(queryClient);
    }
    return CacheManagementService.instance;
  }

  // Comprehensive cache invalidation for trip operations
  invalidateTripRelatedData = async (): Promise<void> => {
    console.log('🔄 CacheManagementService: Invalidating all trip-related data');
    
    // Invalidate all related queries
    await Promise.all([
      this.queryClient.invalidateQueries({ queryKey: ['trips'] }),
      this.queryClient.invalidateQueries({ queryKey: ['vans'] }),
      this.queryClient.invalidateQueries({ queryKey: ['available-vans'] }),
    ]);

    console.log('✅ CacheManagementService: All trip-related caches invalidated');
  };

  // Optimistic update for trip completion
  optimisticTripCompletion = (tripId: number, vanId: string): void => {
    console.log('🔄 CacheManagementService: Applying optimistic trip completion', { tripId, vanId });
    
    // Update trip status optimistically
    this.queryClient.setQueryData(['trips'], (oldTrips: any[]) => 
      oldTrips?.map(trip => 
        trip.id === tripId 
          ? { ...trip, status: 'completed', updated_at: new Date().toISOString() }
          : trip
      ) || []
    );

    // Update van status optimistically
    this.queryClient.setQueryData(['vans'], (oldVans: any[]) => 
      oldVans?.map(van => 
        van.id === vanId 
          ? { ...van, status: 'Actif', updated_at: new Date().toISOString() }
          : van
      ) || []
    );

    console.log('✅ CacheManagementService: Optimistic updates applied');
  };

  // Optimistic update for trip creation
  optimisticTripCreation = (vanId: string): void => {
    console.log('🔄 CacheManagementService: Applying optimistic trip creation for van', vanId);
    
    // Update van status to "En Transit" optimistically
    this.queryClient.setQueryData(['vans'], (oldVans: any[]) => 
      oldVans?.map(van => 
        van.id === vanId 
          ? { ...van, status: 'En Transit', updated_at: new Date().toISOString() }
          : van
      ) || []
    );

    console.log('✅ CacheManagementService: Optimistic van status update applied');
  };

  // Optimistic update for trip deletion
  optimisticTripDeletion = (tripId: number, vanId: string): void => {
    console.log('🔄 CacheManagementService: Applying optimistic trip deletion', { tripId, vanId });
    
    // Remove trip optimistically
    this.queryClient.setQueryData(['trips'], (oldTrips: any[]) => 
      oldTrips?.filter(trip => trip.id !== tripId) || []
    );

    // Update van status to "Actif" optimistically
    this.queryClient.setQueryData(['vans'], (oldVans: any[]) => 
      oldVans?.map(van => 
        van.id === vanId 
          ? { ...van, status: 'Actif', updated_at: new Date().toISOString() }
          : van
      ) || []
    );

    console.log('✅ CacheManagementService: Optimistic deletion updates applied');
  };

  // Force refresh all related data
  forceRefreshAll = async (): Promise<void> => {
    console.log('🔄 CacheManagementService: Force refreshing all data');
    
    // Clear all caches first
    this.queryClient.removeQueries({ queryKey: ['trips'] });
    this.queryClient.removeQueries({ queryKey: ['vans'] });
    this.queryClient.removeQueries({ queryKey: ['available-vans'] });

    // Trigger fresh fetches
    await Promise.all([
      this.queryClient.refetchQueries({ queryKey: ['trips'] }),
      this.queryClient.refetchQueries({ queryKey: ['vans'] }),
    ]);

    console.log('✅ CacheManagementService: All data force refreshed');
  };

  // Rollback optimistic updates (for error handling)
  rollbackOptimisticUpdates = (previousTrips?: any[], previousVans?: any[]): void => {
    console.log('🔄 CacheManagementService: Rolling back optimistic updates');
    
    if (previousTrips) {
      this.queryClient.setQueryData(['trips'], previousTrips);
    }
    
    if (previousVans) {
      this.queryClient.setQueryData(['vans'], previousVans);
    }

    console.log('✅ CacheManagementService: Optimistic updates rolled back');
  };
}
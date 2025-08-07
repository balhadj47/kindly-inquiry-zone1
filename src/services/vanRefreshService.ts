
import { QueryClient } from '@tanstack/react-query';

class VanRefreshService {
  private queryClient: QueryClient | null = null;

  setQueryClient(client: QueryClient) {
    this.queryClient = client;
  }

  async forceRefreshVans() {
    if (!this.queryClient) return;
    
    console.log('🚐 VanRefreshService: Force refreshing all van data');
    
    // Remove all van-related queries from cache
    this.queryClient.removeQueries({ queryKey: ['vans'] });
    
    // Invalidate and refetch immediately
    await this.queryClient.invalidateQueries({ queryKey: ['vans'] });
    await this.queryClient.refetchQueries({ queryKey: ['vans'] });
    
    console.log('🚐 VanRefreshService: Van data refresh completed');
  }

  async refreshAfterTripChange() {
    console.log('🚐 VanRefreshService: Refreshing vans after trip change');
    
    // Add a small delay to ensure database updates are complete
    setTimeout(async () => {
      await this.forceRefreshVans();
    }, 500);
  }
}

export const vanRefreshService = new VanRefreshService();

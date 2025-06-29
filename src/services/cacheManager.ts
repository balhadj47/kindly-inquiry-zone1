
import { useQueryClient } from '@tanstack/react-query';

// Central cache configuration
export const CACHE_KEYS = {
  VANS: ['vans'],
  USERS: ['users'],
  COMPANIES: ['companies'],
  TRIPS: ['trips'],
  BRANCHES: ['branches'],
  MISSION_ROLES: ['mission_roles'],
  USER_GROUPS: ['user_groups'],
} as const;

export const CACHE_DURATIONS = {
  STALE_TIME: {
    SHORT: 30 * 1000,      // 30 seconds
    MEDIUM: 5 * 60 * 1000,  // 5 minutes
    LONG: 10 * 60 * 1000,   // 10 minutes
  },
  GC_TIME: {
    DEFAULT: 10 * 60 * 1000, // 10 minutes
    LONG: 30 * 60 * 1000,    // 30 minutes
  }
} as const;

// Global cache instances
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class GlobalCacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private fetchPromises = new Map<string, Promise<any>>();

  set<T>(key: string, data: T, ttl = CACHE_DURATIONS.STALE_TIME.MEDIUM): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  isValid(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? Date.now() < entry.expiresAt : false;
  }

  clear(keyPattern?: string): void {
    if (keyPattern) {
      const keysToDelete = Array.from(this.cache.keys()).filter(key => 
        key.includes(keyPattern)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  setFetchPromise<T>(key: string, promise: Promise<T>): Promise<T> {
    this.fetchPromises.set(key, promise);
    promise.finally(() => this.fetchPromises.delete(key));
    return promise;
  }

  getFetchPromise<T>(key: string): Promise<T> | null {
    return this.fetchPromises.get(key) || null;
  }

  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    const valid = entries.filter(([, entry]) => now < entry.expiresAt);
    const expired = entries.filter(([, entry]) => now >= entry.expiresAt);
    
    return {
      total: entries.length,
      valid: valid.length,
      expired: expired.length,
      activePromises: this.fetchPromises.size
    };
  }
}

// Export singleton instance
export const globalCache = new GlobalCacheManager();

// React Query cache utilities
export class ReactQueryCacheManager {
  constructor(private queryClient: ReturnType<typeof useQueryClient>) {}

  async invalidateByPattern(pattern: string): Promise<void> {
    await this.queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return Array.isArray(key) && key.some(k => 
          typeof k === 'string' && k.includes(pattern)
        );
      }
    });
  }

  async invalidateMultiple(keys: string[]): Promise<void> {
    const promises = keys.map(key => 
      this.queryClient.invalidateQueries({ queryKey: [key] })
    );
    await Promise.all(promises);
  }

  async refreshMultiple(keys: string[]): Promise<void> {
    const promises = keys.map(key => 
      this.queryClient.refetchQueries({ 
        queryKey: [key],
        type: 'active'
      })
    );
    await Promise.all(promises);
  }

  clearAll(): void {
    this.queryClient.clear();
  }

  getStats() {
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();
    const stale = queries.filter(q => q.isStale()).length;
    const fetching = queries.filter(q => q.state.status === 'pending').length;
    
    return {
      total: queries.length,
      stale,
      fetching,
      active: queries.length - stale
    };
  }
}

// Centralized cache refresh utilities
export const createCacheRefreshManager = (queryClient: ReturnType<typeof useQueryClient>) => {
  const reactQueryCache = new ReactQueryCacheManager(queryClient);

  return {
    // Global cache operations
    clearGlobalCache: (pattern?: string) => {
      globalCache.clear(pattern);
      console.log('🧹 Global cache cleared:', pattern || 'all');
    },

    // React Query operations  
    invalidateQueries: async (keys: string[]) => {
      await reactQueryCache.invalidateMultiple(keys);
      console.log('🔄 Queries invalidated:', keys);
    },

    refreshQueries: async (keys: string[]) => {
      await reactQueryCache.refreshMultiple(keys);
      console.log('✅ Queries refreshed:', keys);
    },

    // Combined operations
    fullRefresh: async (keys: string[]) => {
      globalCache.clear();
      await reactQueryCache.invalidateMultiple(keys);
      await reactQueryCache.refreshMultiple(keys);
      console.log('🔄 Full cache refresh completed for:', keys);
    },

    // Stats and monitoring
    getStats: () => ({
      global: globalCache.getStats(),
      reactQuery: reactQueryCache.getStats()
    }),

    // Convenience methods for common cache operations
    refreshVans: () => reactQueryCache.refreshMultiple(['vans']),
    refreshUsers: () => reactQueryCache.refreshMultiple(['users']),
    refreshCompanies: () => reactQueryCache.refreshMultiple(['companies']),
    refreshTrips: () => reactQueryCache.refreshMultiple(['trips']),

    // Clean up expired entries
    cleanup: () => {
      const stats = globalCache.getStats();
      if (stats.expired > 0) {
        console.log(`🧹 Cleaning up ${stats.expired} expired cache entries`);
        // Clear expired entries
        globalCache.clear();
      }
    }
  };
};

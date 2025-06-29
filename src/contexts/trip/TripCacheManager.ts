
import { globalCache, CACHE_DURATIONS } from '@/services/cacheManager';

// Trip cache manager for optimizing data fetching
const TRIP_CACHE_KEY = 'trips_data';
const TRIP_CACHE_DURATION = 120000; // 2 minutes cache for trips

export const getTripCache = () => {
  return globalCache.get(TRIP_CACHE_KEY);
};

export const isTripCacheValid = () => {
  return globalCache.isValid(TRIP_CACHE_KEY);
};

export const setTripCache = (data: any[]) => {
  globalCache.set(TRIP_CACHE_KEY, data, TRIP_CACHE_DURATION);
};

export const clearTripCache = () => {
  console.log('🧹 Clearing trip cache');
  globalCache.clear('trips');
};

export const getTripFetchPromise = () => {
  return globalCache.getFetchPromise(TRIP_CACHE_KEY);
};

export const setTripFetchPromise = (promise: Promise<any[]> | null) => {
  if (promise) {
    globalCache.setFetchPromise(TRIP_CACHE_KEY, promise);
  }
};

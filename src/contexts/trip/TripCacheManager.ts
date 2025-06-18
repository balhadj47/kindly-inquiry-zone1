
// Trip cache manager for optimizing data fetching
let tripCache: { data: any[]; timestamp: number } | null = null;
let tripFetchPromise: Promise<any[]> | null = null;
const TRIP_CACHE_DURATION = 120000; // 2 minutes cache for trips

export const getTripCache = () => tripCache;

export const isTripCacheValid = () => {
  if (!tripCache) return false;
  return Date.now() - tripCache.timestamp < TRIP_CACHE_DURATION;
};

export const setTripCache = (data: any[]) => {
  tripCache = {
    data,
    timestamp: Date.now()
  };
};

export const clearTripCache = () => {
  console.log('🧹 Clearing trip cache');
  tripCache = null;
  tripFetchPromise = null;
};

export const getTripFetchPromise = () => tripFetchPromise;
export const setTripFetchPromise = (promise: Promise<any[]> | null) => {
  tripFetchPromise = promise;
};

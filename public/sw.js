
// Simplified Service Worker - focusing on core functionality only
const CACHE_NAME = 'ssb-app-v2';
const STATIC_CACHE = 'static-v2';

// Essential static assets only
const STATIC_ASSETS = [
  '/',
  '/index.html'
];

// Install event - minimal caching
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('🔧 Service Worker: Caching essential assets');
        return cache.addAll(STATIC_ASSETS).catch(error => {
          console.warn('🔧 Service Worker: Some assets failed to cache:', error);
          // Don't fail the installation if some assets can't be cached
        });
      })
      .then(() => {
        console.log('🔧 Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('🔧 Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔧 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE) {
              console.log('🔧 Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🔧 Service Worker: Activation complete');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('🔧 Service Worker: Activation failed', error);
      })
  );
});

// Fetch event - simplified handling
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip service worker for API requests and let them go through normally
  if (url.hostname.includes('supabase.co') || url.hostname.includes('lovableproject.com')) {
    return; // Let the request go through without SW intervention
  }

  // Only handle GET requests for static assets
  if (request.method === 'GET' && request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
  }
});

// Simplified navigation request handling
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation requests
    const response = await fetch(request);
    if (response.ok) {
      return response;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('🔧 Service Worker: Network failed, trying cache for:', request.url);
    
    // Fallback to cache
    try {
      const cache = await caches.open(STATIC_CACHE);
      const cachedResponse = await cache.match('/index.html');
      if (cachedResponse) {
        return cachedResponse;
      }
    } catch (cacheError) {
      console.error('🔧 Service Worker: Cache lookup failed:', cacheError);
    }
    
    // Final fallback
    return new Response('Application temporarily unavailable', { 
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Message event for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

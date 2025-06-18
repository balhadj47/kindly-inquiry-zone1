const CACHE_NAME = 'ssb-app-v1';
const STATIC_CACHE = 'static-v1';
const API_CACHE = 'api-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/placeholder.svg'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/rest/v1/users',
  '/rest/v1/trips',
  '/rest/v1/vans',
  '/rest/v1/companies',
  '/rest/v1/user_groups'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('🔧 Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
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
            if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
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
  );
});

// Fetch event - handle caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests (Supabase)
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
  }
});

// Handle API requests with cache-first strategy for reads, network-first for writes
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const isReadRequest = request.method === 'GET';
  
  if (isReadRequest) {
    // Cache-first strategy for GET requests
    try {
      const cache = await caches.open(API_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        console.log('🔧 Service Worker: Serving API response from cache', url.pathname);
        
        // Update cache in background
        fetch(request).then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
        }).catch(() => {
          // Network failed, keep using cached version
        });
        
        return cachedResponse;
      }
      
      // No cache, fetch from network
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
      
    } catch (error) {
      console.error('🔧 Service Worker: API request failed', error);
      return new Response(JSON.stringify({ error: 'Network unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    // Network-first strategy for POST/PUT/DELETE requests
    try {
      const response = await fetch(request);
      
      // If successful, invalidate related cache entries
      if (response.ok) {
        const cache = await caches.open(API_CACHE);
        const keys = await cache.keys();
        
        // Clear related GET requests from cache
        const relatedKeys = keys.filter(key => {
          const keyUrl = new URL(key.url);
          return keyUrl.pathname.includes(url.pathname.split('/')[3]); // table name
        });
        
        await Promise.all(relatedKeys.map(key => cache.delete(key)));
      }
      
      return response;
    } catch (error) {
      // Store failed requests for background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        await storeFailedRequest(request);
        await self.registration.sync.register('background-sync');
      }
      
      return new Response(JSON.stringify({ error: 'Request queued for sync' }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('🔧 Service Worker: Serving static asset from cache', request.url);
      return cachedResponse;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
    
  } catch (error) {
    console.error('🔧 Service Worker: Static request failed', error);
    
    // Return cached index.html for navigation requests as fallback
    if (request.mode === 'navigate') {
      const cache = await caches.open(STATIC_CACHE);
      return cache.match('/index.html');
    }
    
    return new Response('Network unavailable', { status: 503 });
  }
}

// Store failed requests for background sync
async function storeFailedRequest(request) {
  const requestData = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: request.method !== 'GET' ? await request.text() : null,
    timestamp: Date.now()
  };
  
  // Use IndexedDB to store failed requests
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('sync-requests', 1);
    
    dbRequest.onupgradeneeded = () => {
      const db = dbRequest.result;
      if (!db.objectStoreNames.contains('requests')) {
        db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      const transaction = db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      store.add(requestData);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    
    dbRequest.onerror = () => reject(dbRequest.error);
  });
}

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔧 Service Worker: Starting background sync');
    event.waitUntil(syncFailedRequests());
  }
});

// Sync failed requests when online
async function syncFailedRequests() {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('sync-requests', 1);
    
    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      const transaction = db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = async () => {
        const requests = getAllRequest.result;
        
        for (const requestData of requests) {
          try {
            const request = new Request(requestData.url, {
              method: requestData.method,
              headers: requestData.headers,
              body: requestData.body
            });
            
            const response = await fetch(request);
            if (response.ok) {
              // Success - remove from storage
              store.delete(requestData.id);
              console.log('🔧 Service Worker: Synced request', requestData.url);
            }
          } catch (error) {
            console.error('🔧 Service Worker: Failed to sync request', error);
          }
        }
        
        transaction.oncomplete = () => resolve();
      };
    };
    
    dbRequest.onerror = () => reject(dbRequest.error);
  });
}

// Message event for manual cache updates
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

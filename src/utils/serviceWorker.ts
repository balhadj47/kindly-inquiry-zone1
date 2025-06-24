
// Simplified service worker registration with better error handling
export const registerServiceWorker = async () => {
  // Check if service workers are supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('🔧 Service Worker not supported in this environment');
    return null;
  }

  // Skip service worker in development to avoid issues
  if (!import.meta.env.PROD) {
    console.log('🔧 Service Worker registration skipped (development mode)');
    return null;
  }

  try {
    // Check if the browser supports service workers properly
    if (!navigator.serviceWorker) {
      throw new Error('Service Worker API not available');
    }

    // Unregister any existing service worker first to avoid conflicts
    const existingRegistration = await navigator.serviceWorker.getRegistration();
    if (existingRegistration) {
      console.log('🔧 Unregistering existing service worker');
      await existingRegistration.unregister();
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });
    
    console.log('🔧 Service Worker registered successfully:', registration.scope);
    
    // Handle service worker updates
    registration.addEventListener('updatefound', () => {
      console.log('🔧 Service Worker update found');
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔧 New service worker available');
            // Optionally notify user about update
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('🔧 Service Worker registration failed:', error);
    // Don't throw - app should work without service worker
    return null;
  }
};

// Enhanced unregister function
export const unregisterServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const unregisterPromises = registrations.map(registration => registration.unregister());
    const results = await Promise.all(unregisterPromises);
    const success = results.every(result => result);
    console.log('🔧 Service Workers unregistered:', success);
    return success;
  } catch (error) {
    console.error('🔧 Service Worker unregistration failed:', error);
    return false;
  }
};

// Clear all caches
export const clearServiceWorkerCaches = async () => {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    const deletePromises = cacheNames.map(cacheName => caches.delete(cacheName));
    await Promise.all(deletePromises);
    console.log('🔧 All caches cleared');
    return true;
  } catch (error) {
    console.error('🔧 Cache clearing failed:', error);
    return false;
  }
};

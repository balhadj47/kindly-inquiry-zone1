
// Enhanced service worker registration with better browser compatibility
export const registerServiceWorker = async () => {
  // Check if service workers are supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('🔧 Service Worker not supported in this environment');
    return null;
  }

  // Only register in production
  if (!import.meta.env.PROD) {
    console.log('🔧 Service Worker registration skipped (development mode)');
    return null;
  }

  try {
    // Check if the browser supports service workers properly
    if (!navigator.serviceWorker) {
      throw new Error('Service Worker API not available');
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none' // Ensure fresh updates
    });
    
    console.log('🔧 Service Worker registered successfully:', registration.scope);
    
    // Handle service worker updates
    registration.addEventListener('updatefound', () => {
      console.log('🔧 Service Worker update found');
    });

    return registration;
  } catch (error) {
    console.error('🔧 Service Worker registration failed:', error);
    return null;
  }
};

// Unregister service worker (useful for debugging)
export const unregisterServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const success = await registration.unregister();
      console.log('🔧 Service Worker unregistered:', success);
      return success;
    }
    return false;
  } catch (error) {
    console.error('🔧 Service Worker unregistration failed:', error);
    return false;
  }
};


export const registerServiceWorker = async () => {
  // Only register service worker in production and if supported
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('🔧 Service Worker registered successfully:', registration.scope);
      return registration;
    } catch (error) {
      console.error('🔧 Service Worker registration failed:', error);
      return null;
    }
  } else {
    console.log('🔧 Service Worker not registered (development mode or not supported)');
    return null;
  }
};

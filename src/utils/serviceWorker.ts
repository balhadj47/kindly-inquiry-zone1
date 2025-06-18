
// Service Worker registration and management utilities

export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

export const isCacheSupported = (): boolean => {
  return 'caches' in window;
};

export const isBackgroundSyncSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
};

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.warn('🔧 Service Worker not supported');
    return null;
  }

  try {
    console.log('🔧 Registering Service Worker...');
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('🔧 New Service Worker version available');
            showUpdateNotification();
          }
        });
      }
    });

    console.log('🔧 Service Worker registered successfully');
    return registration;
  } catch (error) {
    console.error('🔧 Service Worker registration failed:', error);
    return null;
  }
};

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const unregistered = await registration.unregister();
      console.log('🔧 Service Worker unregistered:', unregistered);
      return unregistered;
    }
    return false;
  } catch (error) {
    console.error('🔧 Service Worker unregistration failed:', error);
    return false;
  }
};

export const clearAllCaches = async (): Promise<void> => {
  if (!isCacheSupported()) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🔧 All caches cleared');
  } catch (error) {
    console.error('🔧 Failed to clear caches:', error);
  }
};

export const updateServiceWorker = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('🔧 Service Worker update triggered');
    }
  } catch (error) {
    console.error('🔧 Service Worker update failed:', error);
  }
};

export const skipWaiting = (): void => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
};

const showUpdateNotification = (): void => {
  // Create a simple notification for app updates
  const updateBanner = document.createElement('div');
  updateBanner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #3b82f6;
      color: white;
      padding: 12px;
      text-align: center;
      z-index: 9999;
      font-size: 14px;
    ">
      <span>Une nouvelle version est disponible.</span>
      <button onclick="this.parentElement.parentElement.remove(); window.location.reload()" 
              style="margin-left: 12px; background: white; color: #3b82f6; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer;">
        Actualiser
      </button>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="margin-left: 8px; background: transparent; color: white; border: 1px solid white; padding: 4px 12px; border-radius: 4px; cursor: pointer;">
        Plus tard
      </button>
    </div>
  `;
  document.body.appendChild(updateBanner);
};

export const getNetworkStatus = (): boolean => {
  return navigator.onLine;
};

export const addNetworkStatusListener = (callback: (isOnline: boolean) => void): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

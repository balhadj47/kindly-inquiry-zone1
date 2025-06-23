
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import React and ensure it's globally available
import * as React from 'react';

// Enhanced browser compatibility checks
const isBrowserSupported = () => {
  // Check for essential modern browser features
  const requiredFeatures = [
    'Promise',
    'fetch',
    'Map',
    'Set',
    'Symbol',
    'Object.assign'
  ];

  return requiredFeatures.every(feature => {
    const hasFeature = feature.includes('.') 
      ? feature.split('.').reduce((obj, prop) => obj && obj[prop], window)
      : window[feature];
    
    if (!hasFeature) {
      console.warn(`❌ Missing browser feature: ${feature}`);
      return false;
    }
    return true;
  });
};

// Critical: Ensure React is available before any other code runs
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (globalThis as any).React = React;
}

// Simplified React validation - only check React object structure
const validateReact = () => {
  if (!React) {
    console.error('❌ CRITICAL: React not available');
    throw new Error('React not available - React not properly loaded');
  }
  
  // Only check that React has the expected properties, don't test functions
  const requiredHooks = ['useState', 'useEffect', 'useContext'];
  const missingHooks = requiredHooks.filter(hook => !(hook in React));
  
  if (missingHooks.length > 0) {
    console.error('❌ CRITICAL: Missing React hooks:', missingHooks);
    throw new Error(`React hooks not available: ${missingHooks.join(', ')}`);
  }
  
  return true;
};

// Run React validation
validateReact();

console.log('✅ React validation passed:', {
  version: React.version,
  hasUseState: 'useState' in React,
  hasUseEffect: 'useEffect' in React,
  hasUseContext: 'useContext' in React
});

// Browser compatibility check
if (!isBrowserSupported()) {
  console.error('❌ Browser not supported');
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
      background: #f9fafb;
      margin: 0;
      padding: 20px;
      text-align: center;
    ">
      <div style="
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 400px;
      ">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Browser Not Supported</h1>
        <p style="color: #6b7280; margin-bottom: 1.5rem;">
          Please use a modern browser like Chrome 80+, Firefox 75+, Safari 13+, or Edge 80+.
        </p>
        <button onclick="window.location.reload()" style="
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        ">
          Retry
        </button>
      </div>
    </div>
  `;
  throw new Error('Browser not supported');
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Enhanced error fallback component
const ErrorFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
        <p className="text-gray-600 mb-4">The application failed to start properly.</p>
        <div className="space-y-2 mb-4">
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reload Application
          </button>
          <button 
            onClick={() => localStorage.clear() || window.location.reload()}
            className="w-full px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Clear Cache & Reload
          </button>
        </div>
        <p className="text-xs text-gray-500">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

// Wrap the App with enhanced error handling
const SafeApp = () => {
  try {
    // Simple runtime check - only verify React is available (no function testing)
    if (!React) {
      throw new Error('React is not available at runtime');
    }
    return <App />;
  } catch (error) {
    console.error('❌ App render error:', error);
    return <ErrorFallback />;
  }
};

root.render(
  <StrictMode>
    <SafeApp />
  </StrictMode>
);

// Enhanced service worker registration with better error handling
if (import.meta.env.PROD && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  import('./utils/serviceWorker').then(({ registerServiceWorker }) => {
    registerServiceWorker().catch(error => {
      console.warn('🔧 Service Worker registration failed:', error);
      // Don't throw - app should work without service worker
    });
  }).catch(() => {
    console.warn('🔧 Service Worker module failed to load');
  });
} else {
  console.log('🔧 Service Worker registration skipped (development mode or not supported)');
}

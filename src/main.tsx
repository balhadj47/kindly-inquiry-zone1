
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/serviceWorker';

// Import React explicitly and make it available globally IMMEDIATELY
import * as React from 'react';

// CRITICAL: Make React globally available before any other imports or operations
declare global {
  interface Window {
    React: typeof React;
  }
}

// Force React to be available globally
window.React = React;

// Validate that React hooks are working
try {
  const testState = React.useState(0);
  const testEffect = React.useEffect;
  const testContext = React.useContext;
  
  if (!testState || !testEffect || !testContext) {
    throw new Error('React hooks validation failed');
  }
  
  console.log('✅ React hooks validated successfully');
} catch (error) {
  console.error('❌ CRITICAL: React hooks validation failed:', error);
  throw new Error('React initialization failed - hooks not available');
}

// Only log in development
if (import.meta.env.DEV) {
  console.log('🌟 Main: Starting application with React version:', React.version);
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

if (import.meta.env.DEV) {
  console.log('🌟 Main: React root created, rendering App...');
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker after the app is rendered
registerServiceWorker().then((registration) => {
  if (registration) {
    console.log('🔧 Service Worker registered with scope:', registration.scope);
  }
}).catch((error) => {
  console.error('🔧 Service Worker registration error:', error);
});

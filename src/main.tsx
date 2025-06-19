
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/serviceWorker';

// Import React explicitly and make it available globally
import React from 'react';

// Critical: Ensure React is available globally BEFORE anything else
if (typeof window !== 'undefined') {
  (window as any).React = React;
  
  // Validate React is properly loaded
  if (!React || !React.useState || !React.useContext || !React.useEffect) {
    console.error('❌ CRITICAL: React or React hooks not available');
    throw new Error('React initialization failed - hooks not available');
  }
  
  console.log('✅ React initialized successfully with version:', React.version);
  console.log('✅ React hooks validated:', {
    useState: !!React.useState,
    useContext: !!React.useContext,
    useEffect: !!React.useEffect
  });
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


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/serviceWorker';

// Import React explicitly and make it available globally
import React from 'react';

// Ensure React and its hooks are available globally
if (typeof window !== 'undefined') {
  (window as any).React = React;
  console.log('🔧 Main: React made available globally:', !!React);
  console.log('🔧 Main: React hooks available:', !!React.useState, !!React.useContext, !!React.useEffect);
}

// Validate React hooks availability before continuing
if (!React.useState || !React.useContext || !React.useEffect) {
  console.error('❌ CRITICAL: React hooks not available in main.tsx');
  throw new Error('React hooks not available');
}

// Only log in development
if (import.meta.env.DEV) {
  console.log('🌟 Main: Starting application with React version:', React.version);
  console.log('🌟 Main: React hooks available:', !!React.useState, !!React.useContext);
}

const rootElement = document.getElementById("root");

if (import.meta.env.DEV) {
  console.log('🌟 Main: Root element:', rootElement);
}

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

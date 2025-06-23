
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import React and ensure it's globally available
import * as React from 'react';

// Critical: Ensure React is available before any other code runs
if (typeof window !== 'undefined') {
  (window as any).React = React;
  // Also ensure it's available on globalThis
  (globalThis as any).React = React;
}

// Validate React is properly loaded
if (!React || !React.useState || !React.useEffect || !React.useContext) {
  console.error('❌ CRITICAL: React hooks not available');
  throw new Error('React hooks not available - React not properly loaded');
}

// Additional validation for useContext specifically
if (!React.useContext) {
  console.error('❌ CRITICAL: React.useContext not available');
  throw new Error('React.useContext not available');
}

console.log('✅ React validation passed:', {
  version: React.version,
  hasUseState: !!React.useState,
  hasUseEffect: !!React.useEffect,
  hasUseContext: !!React.useContext
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Simple error fallback component
const ErrorFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
        <p className="text-gray-600 mb-4">The application failed to start properly.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reload Application
        </button>
      </div>
    </div>
  );
};

// Wrap the App with error handling
const SafeApp = () => {
  try {
    // Additional runtime check for React context
    if (!React.useContext) {
      throw new Error('React.useContext is not available at runtime');
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

// Register service worker after the app is rendered, only in production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then((registration) => {
      console.log('🔧 Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('🔧 Service Worker registration error:', error);
    });
} else {
  console.log('🔧 Service Worker registration skipped (development mode)');
}

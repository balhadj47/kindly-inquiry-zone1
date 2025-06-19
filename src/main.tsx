
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/serviceWorker';

// Import React and ensure it's globally available
import * as React from 'react';

// Make React globally available immediately
if (typeof window !== 'undefined') {
  (window as any).React = React;
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

// Wrap the App in an error boundary at the highest level
const AppWithErrorBoundary = () => {
  try {
    return <App />;
  } catch (error) {
    console.error('❌ Critical App error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Application Error</h1>
          <p className="text-gray-600 mb-4">The application failed to start properly.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

root.render(
  <StrictMode>
    <AppWithErrorBoundary />
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

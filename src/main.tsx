
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🌟 Main: Starting application...');
console.log('🌟 Main: App component:', App);

const rootElement = document.getElementById("root");
console.log('🌟 Main: Root element:', rootElement);

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
console.log('🌟 Main: React root created, rendering App...');

root.render(<App />);


import React, { useEffect } from 'react';

interface ConsoleError {
  message: string;
  source: string;
  timestamp: number;
}

const ErrorTracker = () => {
  useEffect(() => {
    // Store original console methods safely
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const errors: ConsoleError[] = [];

    // Safely override console.error
    console.error = (...args) => {
      try {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        errors.push({
          message,
          source: 'error',
          timestamp: Date.now()
        });
        
        // Always call original console.error
        originalConsoleError.apply(console, args);
        
        // Log summary safely
        if (errors.length > 0) {
          console.log('🔍 Recent Console Errors:', errors.slice(-3));
        }
      } catch (error) {
        // Fallback to original console if tracking fails
        originalConsoleError.apply(console, args);
      }
    };

    // Safely override console.warn
    console.warn = (...args) => {
      try {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        // Filter out known non-critical warnings
        if (!message.includes('React Router') && 
            !message.includes('deprecated') && 
            !message.includes('Warning: ReactDOM.render')) {
          errors.push({
            message,
            source: 'warning',
            timestamp: Date.now()
          });
        }
        
        // Always call original console.warn
        originalConsoleWarn.apply(console, args);
      } catch (error) {
        // Fallback to original console if tracking fails
        originalConsoleWarn.apply(console, args);
      }
    };

    // Cleanup function to restore original console methods
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return null;
};

export default ErrorTracker;

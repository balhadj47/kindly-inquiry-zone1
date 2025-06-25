
import React, { useEffect } from 'react';

interface ConsoleError {
  message: string;
  source: string;
  timestamp: number;
}

const ErrorTracker = () => {
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const errors: ConsoleError[] = [];

    // Override console.error to track errors
    console.error = (...args) => {
      const message = args.join(' ');
      errors.push({
        message,
        source: 'error',
        timestamp: Date.now()
      });
      
      // Still call original console.error
      originalConsoleError.apply(console, args);
      
      // Log summary of recent errors
      if (errors.length > 0) {
        console.log('🔍 Recent Console Errors:', errors.slice(-5));
      }
    };

    // Override console.warn to track warnings
    console.warn = (...args) => {
      const message = args.join(' ');
      if (!message.includes('React Router') && !message.includes('deprecated')) {
        errors.push({
          message,
          source: 'warning',
          timestamp: Date.now()
        });
      }
      
      // Still call original console.warn
      originalConsoleWarn.apply(console, args);
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

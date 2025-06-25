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

    // Enhanced error filtering and categorization
    const isContextError = (message: string) => {
      return message.includes('must be used within a') || 
             message.includes('Context') ||
             message.includes('Provider') ||
             message.includes('useRBAC') ||
             message.includes('useLanguage');
    };

    const isReactHookError = (message: string) => {
      return message.includes('useState') ||
             message.includes('useEffect') ||
             message.includes('useContext') ||
             message.includes('Cannot read properties of null') ||
             message.includes('hook');
    };

    const isPermissionError = (message: string) => {
      return message.includes('permission') ||
             message.includes('RBAC') ||
             message.includes('hasPermission');
    };

    // Safely override console.error
    console.error = (...args) => {
      try {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        // Always call original console.error first
        originalConsoleError.apply(console, args);
        
        // Categorize and store error
        const errorType = isContextError(message) ? 'context' : 
                         isReactHookError(message) ? 'react-hook' : 
                         isPermissionError(message) ? 'permission' : 'general';
        
        errors.push({
          message: `[${errorType.toUpperCase()}] ${message}`,
          source: 'error',
          timestamp: Date.now()
        });
        
        // Log summary for critical errors
        if (isContextError(message) || isReactHookError(message) || isPermissionError(message)) {
          console.log('🚨 CRITICAL ERROR DETECTED:', {
            type: errorType,
            message: message.substring(0, 100),
            timestamp: new Date().toISOString(),
            stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n')
          });
        }
        
        // Keep only recent errors
        if (errors.length > 15) {
          errors.splice(0, errors.length - 15);
        }
        
      } catch (trackingError) {
        // Fallback to original console if tracking fails
        originalConsoleError.apply(console, args);
        originalConsoleError('ErrorTracker failed:', trackingError);
      }
    };

    // Safely override console.warn
    console.warn = (...args) => {
      try {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        // Always call original console.warn first
        originalConsoleWarn.apply(console, args);
        
        // Filter out known non-critical warnings but include context warnings
        if (!message.includes('React Router') && 
            !message.includes('deprecated') && 
            !message.includes('Warning: ReactDOM.render') &&
            !message.includes('DevTools')) {
          
          const errorType = isContextError(message) ? 'context-warn' : 'warning';
          
          errors.push({
            message: `[${errorType.toUpperCase()}] ${message}`,
            source: 'warning',
            timestamp: Date.now()
          });

          // Log context warnings as they're important
          if (isContextError(message)) {
            console.log('⚠️ CONTEXT WARNING:', {
              message: message.substring(0, 100),
              timestamp: new Date().toISOString()
            });
          }
        }
        
      } catch (trackingError) {
        // Fallback to original console if tracking fails
        originalConsoleWarn.apply(console, args);
        originalConsoleError('ErrorTracker warn failed:', trackingError);
      }
    };

    // Add global error handler for unhandled errors
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('🚨 UNHANDLED ERROR:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 UNHANDLED PROMISE REJECTION:', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup function to restore original console methods
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
};

export default ErrorTracker;

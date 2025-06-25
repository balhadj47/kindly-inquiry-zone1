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
             message.includes('Cannot read property') ||
             message.includes('hook');
    };

    const isPermissionError = (message: string) => {
      return message.includes('permission') ||
             message.includes('RBAC') ||
             message.includes('hasPermission');
    };

    const isTypeError = (message: string) => {
      return message.includes('Property') && message.includes('does not exist') ||
             message.includes('is not a function') ||
             message.includes('undefined is not') ||
             message.includes('null is not');
    };

    const isBrowserExtensionError = (message: string) => {
      return message.includes('chrome-extension://') ||
             message.includes('extension') ||
             message.includes('inpage.js') ||
             message.includes('content script') ||
             message.includes('browser extension');
    };

    const isNetworkError = (message: string) => {
      return message.includes('fetch') ||
             message.includes('network') ||
             message.includes('cors') ||
             message.includes('Failed to load');
    };

    // Safely override console.error
    console.error = (...args) => {
      try {
        const message = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        
        // Always call original console.error first
        originalConsoleError.apply(console, args);
        
        // Filter out browser extension errors as they're not our concern
        if (isBrowserExtensionError(message)) {
          console.log('🔇 Filtered browser extension error:', message.substring(0, 100));
          return;
        }
        
        // Categorize and store error
        const errorType = isContextError(message) ? 'context' : 
                         isReactHookError(message) ? 'react-hook' : 
                         isPermissionError(message) ? 'permission' :
                         isTypeError(message) ? 'type-error' : 
                         isNetworkError(message) ? 'network' : 'general';
        
        errors.push({
          message: `[${errorType.toUpperCase()}] ${message}`,
          source: 'error',
          timestamp: Date.now()
        });
        
        // Log summary for critical errors
        if (isContextError(message) || isReactHookError(message) || isPermissionError(message) || isTypeError(message)) {
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
        const message = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        
        // Always call original console.warn first
        originalConsoleWarn.apply(console, args);
        
        // Filter out browser extension warnings
        if (isBrowserExtensionError(message)) {
          return;
        }
        
        // Filter out known non-critical warnings but include context warnings
        if (!message.includes('React Router') && 
            !message.includes('deprecated') && 
            !message.includes('Warning: ReactDOM.render') &&
            !message.includes('DevTools') &&
            !message.includes('defaultProps')) {
          
          const errorType = isContextError(message) ? 'context-warn' : 
                           isPermissionError(message) ? 'permission-warn' :
                           isTypeError(message) ? 'type-warn' : 'warning';
          
          errors.push({
            message: `[${errorType.toUpperCase()}] ${message}`,
            source: 'warning',
            timestamp: Date.now()
          });

          // Log context warnings as they're important
          if (isContextError(message) || isPermissionError(message)) {
            console.log('⚠️ IMPORTANT WARNING:', {
              type: errorType,
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
      try {
        // Filter out browser extension errors
        if (event.filename?.includes('chrome-extension://') || 
            event.message?.includes('chrome-extension://')) {
          return;
        }
        
        console.error('🚨 UNHANDLED ERROR:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      } catch (error) {
        originalConsoleError('🚨 UNHANDLED ERROR (fallback):', event);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        // Filter out browser extension promise rejections
        if (event.reason?.message?.includes('chrome-extension://') ||
            event.reason?.stack?.includes('chrome-extension://')) {
          return;
        }
        
        console.error('🚨 UNHANDLED PROMISE REJECTION:', {
          reason: event.reason,
          stack: event.reason?.stack
        });
      } catch (error) {
        originalConsoleError('🚨 UNHANDLED PROMISE REJECTION (fallback):', event);
      }
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

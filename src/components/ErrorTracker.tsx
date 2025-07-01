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
    const originalConsoleLog = console.log;
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
             message.includes('hook') ||
             message.includes('rendered more hooks') ||
             message.includes('Hook called conditionally');
    };

    const isPermissionError = (message: string) => {
      return message.includes('permission') ||
             message.includes('RBAC') ||
             message.includes('hasPermission') ||
             message.includes('role') ||
             message.includes('unauthorized');
    };

    const isTypeError = (message: string) => {
      return message.includes('Property') && message.includes('does not exist') ||
             message.includes('is not a function') ||
             message.includes('undefined is not') ||
             message.includes('null is not') ||
             message.includes('TypeError');
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
             message.includes('Failed to load') ||
             message.includes('500') ||
             message.includes('404');
    };

    const isSupabaseError = (message: string) => {
      return message.includes('supabase') ||
             message.includes('auth') ||
             message.includes('RLS') ||
             message.includes('database');
    };

    // Enhanced console.error override
    console.error = (...args) => {
      try {
        const message = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        
        // Always call original console.error first
        originalConsoleError.apply(console, args);
        
        // Filter out browser extension errors
        if (isBrowserExtensionError(message)) {
          return;
        }
        
        // Store critical errors only
        if (isContextError(message) || isReactHookError(message) || isPermissionError(message) || isTypeError(message)) {
          errors.push({
            message: `[ERROR] ${message}`,
            source: 'error',
            timestamp: Date.now()
          });
        }
        
        // Keep only recent errors
        if (errors.length > 10) {
          errors.splice(0, errors.length - 10);
        }
        
      } catch (trackingError) {
        originalConsoleError.apply(console, args);
      }
    };

    // Enhanced console.warn override
    console.warn = (...args) => {
      try {
        const message = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        
        // Always call original console.warn first
        originalConsoleWarn.apply(console, args);
        
        // Filter out browser extension warnings and non-critical warnings
        if (isBrowserExtensionError(message) ||
            message.includes('React Router') || 
            message.includes('deprecated') || 
            message.includes('Warning: ReactDOM.render') ||
            message.includes('DevTools') ||
            message.includes('defaultProps')) {
          return;
        }
        
      } catch (trackingError) {
        originalConsoleWarn.apply(console, args);
      }
    };

    // Simplified console.log override - only keep critical debugging
    console.log = (...args) => {
      try {
        const message = args.join(' ');
        
        // Only show critical errors, suppress debug info
        if (message.includes('🚨') || message.includes('❌')) {
          originalConsoleLog.apply(console, args);
        }
        
      } catch (trackingError) {
        originalConsoleLog.apply(console, args);
      }
    };

    // Global error handlers
    const handleGlobalError = (event: ErrorEvent) => {
      try {
        if (event.filename?.includes('chrome-extension://') || 
            event.message?.includes('chrome-extension://')) {
          return;
        }
        
        console.error('UNHANDLED GLOBAL ERROR:', {
          message: event.message,
          filename: event.filename,
          stack: event.error?.stack?.substring(0, 200)
        });
      } catch (error) {
        originalConsoleError('UNHANDLED ERROR:', event);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        if (event.reason?.message?.includes('chrome-extension://') ||
            event.reason?.stack?.includes('chrome-extension://')) {
          return;
        }
        
        console.error('UNHANDLED PROMISE REJECTION:', {
          reason: event.reason,
          stack: event.reason?.stack?.substring(0, 200)
        });
      } catch (error) {
        originalConsoleError('UNHANDLED PROMISE REJECTION:', event);
      }
    };

    // Add global listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup function
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.log = originalConsoleLog;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
};

export default ErrorTracker;

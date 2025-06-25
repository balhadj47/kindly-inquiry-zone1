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
          console.log('🔇 Filtered browser extension error:', message.substring(0, 100));
          return;
        }
        
        // Categorize and store error
        const errorType = isContextError(message) ? 'CONTEXT' : 
                         isReactHookError(message) ? 'REACT-HOOK' : 
                         isPermissionError(message) ? 'PERMISSION' :
                         isTypeError(message) ? 'TYPE-ERROR' : 
                         isNetworkError(message) ? 'NETWORK' :
                         isSupabaseError(message) ? 'SUPABASE' : 'GENERAL';
        
        errors.push({
          message: `[${errorType}] ${message}`,
          source: 'error',
          timestamp: Date.now()
        });
        
        // Enhanced logging for critical errors
        if (isContextError(message) || isReactHookError(message) || isPermissionError(message) || isTypeError(message)) {
          console.log('🚨 CRITICAL APPLICATION ERROR:', {
            type: errorType,
            message: message.substring(0, 200),
            timestamp: new Date().toISOString(),
            component: message.includes('Component') ? message.match(/Component:\s*(\w+)/)?.[1] : 'Unknown',
            stackTrace: new Error().stack?.split('\n').slice(1, 5).join('\n')
          });
          
          // Add debugging info for specific error types
          if (isContextError(message)) {
            console.log('🔍 Context Debug Info:', {
              availableContexts: ['RBACContext', 'LanguageContext', 'AuthContext', 'TripContext'],
              checkProviderHierarchy: 'Ensure component is wrapped in provider'
            });
          }
          
          if (isPermissionError(message)) {
            console.log('🔍 Permission Debug Info:', {
              currentUser: 'Check if user is loaded',
              hasPermissionFunction: 'Verify function exists and works',
              roleData: 'Check if roles are loaded from database'
            });
          }
        }
        
        // Keep only recent errors
        if (errors.length > 20) {
          errors.splice(0, errors.length - 20);
        }
        
      } catch (trackingError) {
        originalConsoleError.apply(console, args);
        originalConsoleError('🚨 ErrorTracker failed:', trackingError);
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
        
        // Filter out browser extension warnings
        if (isBrowserExtensionError(message)) {
          return;
        }
        
        // Filter out known non-critical warnings but include important ones
        if (!message.includes('React Router') && 
            !message.includes('deprecated') && 
            !message.includes('Warning: ReactDOM.render') &&
            !message.includes('DevTools') &&
            !message.includes('defaultProps')) {
          
          const errorType = isContextError(message) ? 'CONTEXT-WARN' : 
                           isPermissionError(message) ? 'PERMISSION-WARN' :
                           isTypeError(message) ? 'TYPE-WARN' : 
                           isSupabaseError(message) ? 'SUPABASE-WARN' : 'WARNING';
          
          errors.push({
            message: `[${errorType}] ${message}`,
            source: 'warning',
            timestamp: Date.now()
          });

          // Log important warnings
          if (isContextError(message) || isPermissionError(message) || isSupabaseError(message)) {
            console.log('⚠️ IMPORTANT WARNING:', {
              type: errorType,
              message: message.substring(0, 200),
              timestamp: new Date().toISOString()
            });
          }
        }
        
      } catch (trackingError) {
        originalConsoleWarn.apply(console, args);
        originalConsoleError('⚠️ ErrorTracker warn failed:', trackingError);
      }
    };

    // Enhanced console.log override for debugging
    console.log = (...args) => {
      try {
        // Always call original first
        originalConsoleLog.apply(console, args);
        
        // Track application flow for debugging
        const message = args.join(' ');
        if (message.includes('🚨') || message.includes('❌') || message.includes('⚠️')) {
          console.log('📊 Debug Info:', {
            timestamp: new Date().toISOString(),
            location: window.location.pathname,
            userAgent: navigator.userAgent.substring(0, 100)
          });
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
        
        console.error('🚨 UNHANDLED GLOBAL ERROR:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack?.substring(0, 500),
          timestamp: new Date().toISOString(),
          url: window.location.href
        });
      } catch (error) {
        originalConsoleError('🚨 UNHANDLED ERROR (fallback):', event);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        if (event.reason?.message?.includes('chrome-extension://') ||
            event.reason?.stack?.includes('chrome-extension://')) {
          return;
        }
        
        console.error('🚨 UNHANDLED PROMISE REJECTION:', {
          reason: event.reason,
          stack: event.reason?.stack?.substring(0, 500),
          timestamp: new Date().toISOString(),
          url: window.location.href
        });
      } catch (error) {
        originalConsoleError('🚨 UNHANDLED PROMISE REJECTION (fallback):', event);
      }
    };

    // Add global listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Log initialization
    console.log('✅ Enhanced ErrorTracker initialized:', {
      timestamp: new Date().toISOString(),
      location: window.location.pathname,
      features: ['Context errors', 'Permission errors', 'Type errors', 'Network errors', 'Supabase errors']
    });

    // Cleanup function
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.log = originalConsoleLog;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.log('🧹 ErrorTracker cleaned up');
    };
  }, []);

  return null;
};

export default ErrorTracker;

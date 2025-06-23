
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  shouldRedirectToAuth: boolean;
  errorMessage: string;
  errorStack?: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    shouldRedirectToAuth: false,
    errorMessage: '',
    errorStack: undefined
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary caught an error:', error);
    
    // Enhanced error categorization for better cross-browser handling
    const errorMessage = error.message || 'Unknown error occurred';
    const errorStack = error.stack;
    
    // Check if it's a React hooks error (like NetworkStatus useState issue)
    const isReactHooksError = errorMessage.includes('useState') || 
                             errorMessage.includes('useEffect') ||
                             errorMessage.includes('useContext') ||
                             errorMessage.includes('Cannot read properties of null') ||
                             errorMessage.includes('Cannot read property') ||
                             errorMessage.includes('is not a function');
    
    // Check if it's a server error (500, 505, etc.)
    const isServerError = errorMessage.includes('500') || 
                         errorMessage.includes('505') ||
                         errorMessage.includes('Internal Server Error') ||
                         errorMessage.includes('HTTP Version Not Supported') ||
                         errorMessage.includes('Network Error') ||
                         errorMessage.includes('Failed to fetch');
    
    // Check for browser compatibility issues
    const isBrowserCompatError = errorMessage.includes('not supported') ||
                                errorMessage.includes('undefined is not a function') ||
                                errorMessage.includes('Object doesn\'t support property') ||
                                errorMessage.includes('Cannot find variable');
    
    // Check for service worker issues
    const isServiceWorkerError = errorMessage.includes('ServiceWorker') ||
                                errorMessage.includes('FetchEvent') ||
                                errorMessage.includes('navigator.serviceWorker');
    
    console.log('🔍 Error analysis:', {
      isReactHooksError,
      isServerError,
      isBrowserCompatError,
      isServiceWorkerError,
      errorMessage: errorMessage.substring(0, 100)
    });
    
    return { 
      hasError: true, 
      shouldRedirectToAuth: isServerError,
      errorMessage,
      errorStack
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Enhanced error reporting for debugging
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    console.error('📊 Error report:', errorReport);
    
    // Only redirect for server errors, not React hooks errors or browser compat issues
    if (this.state.shouldRedirectToAuth) {
      // Use window.location for redirects to avoid React Router context issues
      setTimeout(() => {
        console.log('Server error detected, redirecting to auth page');
        try {
          window.location.href = '/auth';
        } catch (redirectError) {
          console.error('Failed to redirect:', redirectError);
          window.location.reload();
        }
      }, 100);
    } else {
      // For other errors, try to redirect to dashboard after a delay
      setTimeout(() => {
        if (!error.message.includes('useState') && 
            !error.message.includes('useEffect') &&
            !error.message.includes('ServiceWorker')) {
          console.log('Application error detected, redirecting to dashboard');
          try {
            window.location.href = '/dashboard';
          } catch (redirectError) {
            console.error('Failed to redirect:', redirectError);
            window.location.reload();
          }
        }
      }, 100);
    }
  }

  // Enhanced retry mechanism
  private handleRetry = () => {
    console.log('🔄 User triggered retry');
    this.setState({
      hasError: false,
      shouldRedirectToAuth: false,
      errorMessage: '',
      errorStack: undefined
    });
  };

  private handleReload = () => {
    console.log('🔄 User triggered reload');
    try {
      window.location.reload();
    } catch (error) {
      console.error('Failed to reload:', error);
      // Fallback: try to navigate to home
      window.location.href = '/';
    }
  };

  private handleClearCacheAndReload = () => {
    console.log('🧹 User triggered cache clear and reload');
    try {
      // Clear various browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear service worker cache if possible
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister();
          });
        }).catch(console.warn);
      }
      
      // Clear browser cache if possible (limited support)
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        }).catch(console.warn);
      }
      
      // Force reload
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear cache:', error);
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Enhanced error display with more options
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <div className="text-red-600 text-4xl mb-2">⚠️</div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                The application encountered an error and needs to recover.
              </p>
            </div>
            
            {/* Error details (collapsible) */}
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Technical Details
              </summary>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-gray-700 max-h-32 overflow-auto">
                <div className="mb-1">
                  <strong>Error:</strong> {this.state.errorMessage}
                </div>
                {this.state.errorStack && (
                  <div>
                    <strong>Stack:</strong> 
                    <pre className="whitespace-pre-wrap text-xs mt-1">
                      {this.state.errorStack.substring(0, 500)}
                      {this.state.errorStack.length > 500 ? '...' : ''}
                    </pre>
                  </div>
                )}
              </div>
            </details>

            {/* Action buttons */}
            <div className="space-y-2">
              <button 
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Try Again
              </button>
              <button 
                onClick={this.handleReload}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reload Page
              </button>
              <button 
                onClick={this.handleClearCacheAndReload}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Clear Cache & Reload
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              If the problem persists, try using a different browser or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

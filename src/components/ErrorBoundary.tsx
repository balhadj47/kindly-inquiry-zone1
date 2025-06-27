
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
    
    const errorMessage = error.message || 'Unknown error occurred';
    const errorStack = error.stack;
    
    // Enhanced error categorization
    const isReactHooksError = errorMessage.includes('useState') || 
                             errorMessage.includes('useEffect') ||
                             errorMessage.includes('useContext') ||
                             errorMessage.includes('Cannot read properties of null') ||
                             errorMessage.includes('Cannot read property') ||
                             errorMessage.includes('is not a function');
    
    const isServerError = errorMessage.includes('500') || 
                         errorMessage.includes('505') ||
                         errorMessage.includes('Internal Server Error') ||
                         errorMessage.includes('Network Error') ||
                         errorMessage.includes('Failed to fetch');
    
    const isBrowserCompatError = errorMessage.includes('not supported') ||
                                errorMessage.includes('undefined is not a function') ||
                                errorMessage.includes('Object doesn\'t support property');
    
    const isPermissionError = errorMessage.includes('permission') ||
                             errorMessage.includes('access denied') ||
                             errorMessage.includes('unauthorized');
    
    console.log('🔍 Error analysis:', {
      isReactHooksError,
      isServerError,
      isBrowserCompatError,
      isPermissionError,
      errorMessage: errorMessage.substring(0, 100)
    });
    
    return { 
      hasError: true, 
      shouldRedirectToAuth: isServerError || isPermissionError,
      errorMessage,
      errorStack
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Uncaught error:', error, errorInfo);
    
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    console.error('📊 Error report:', errorReport);
    
    // Only redirect for server errors, not React hooks errors
    if (this.state.shouldRedirectToAuth) {
      setTimeout(() => {
        console.log('Server/Permission error detected, redirecting...');
        try {
          window.location.href = '/auth';
        } catch (redirectError) {
          console.error('Failed to redirect:', redirectError);
          window.location.reload();
        }
      }, 1000);
    }
  }

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
      window.location.href = '/';
    }
  };

  private handleClearCacheAndReload = () => {
    console.log('🧹 User triggered cache clear and reload');
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister();
          });
        }).catch(console.warn);
      }
      
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        }).catch(console.warn);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear cache:', error);
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <div className="text-red-600 text-4xl mb-2">⚠️</div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Une erreur s'est produite
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                L'application a rencontré une erreur et doit récupérer.
              </p>
            </div>
            
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Détails techniques
              </summary>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-gray-700 max-h-32 overflow-auto">
                <div className="mb-1">
                  <strong>Erreur:</strong> {this.state.errorMessage}
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

            <div className="space-y-2">
              <button 
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Réessayer
              </button>
              <button 
                onClick={this.handleReload}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Recharger la page
              </button>
              <button 
                onClick={this.handleClearCacheAndReload}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Vider le cache et recharger
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Si le problème persiste, essayez d'utiliser un autre navigateur ou contactez le support technique.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

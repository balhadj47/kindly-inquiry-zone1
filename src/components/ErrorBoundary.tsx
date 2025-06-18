
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  shouldRedirectToAuth: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    shouldRedirectToAuth: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary caught an error:', error);
    
    // Check if it's a React hooks error (like NetworkStatus useState issue)
    const isReactHooksError = error.message.includes('useState') || 
                             error.message.includes('useEffect') ||
                             error.message.includes('Cannot read properties of null');
    
    // Check if it's a server error (500, 505, etc.)
    const isServerError = error.message.includes('500') || 
                         error.message.includes('505') ||
                         error.message.includes('Internal Server Error') ||
                         error.message.includes('HTTP Version Not Supported');
    
    // For React hooks errors, don't redirect, just show fallback
    if (isReactHooksError) {
      return { 
        hasError: true, 
        shouldRedirectToAuth: false 
      };
    }
    
    return { 
      hasError: true, 
      shouldRedirectToAuth: isServerError 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Only redirect for server errors, not React hooks errors
    if (this.state.shouldRedirectToAuth) {
      // Use window.location for redirects to avoid React Router context issues
      setTimeout(() => {
        console.log('Server error detected, redirecting to auth page');
        window.location.href = '/auth';
      }, 100);
    } else {
      // For other errors (including React hooks), try to redirect to dashboard
      setTimeout(() => {
        if (!error.message.includes('useState') && !error.message.includes('useEffect')) {
          console.log('Application error detected, redirecting to dashboard');
          window.location.href = '/dashboard';
        }
      }, 100);
    }
  }

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Return a simple loading state instead of Navigate components
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

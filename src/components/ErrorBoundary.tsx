
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
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
    
    // Check if it's a server error (500, 505, etc.)
    const isServerError = error.message.includes('500') || 
                         error.message.includes('505') ||
                         error.message.includes('Internal Server Error') ||
                         error.message.includes('HTTP Version Not Supported');
    
    return { 
      hasError: true, 
      shouldRedirectToAuth: isServerError 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.state.shouldRedirectToAuth) {
        console.log('Server error detected, redirecting to auth page');
        return <Navigate to="/auth" replace />;
      }
      
      // For other errors, redirect to dashboard
      console.log('Application error detected, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

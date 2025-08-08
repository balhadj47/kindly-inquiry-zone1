
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorHandler } from '@/services/errorHandlingService';
import { ErrorState } from './ErrorStates';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class StandardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const context = this.props.context || 'Component';
    console.error(`🔴 ErrorBoundary caught an error in ${context}:`, error);
    console.error('🔴 Error info:', errorInfo);
    
    // Use our standardized error handling
    errorHandler.classifyError(error, context);
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    });
    
    // Force a re-render by reloading the page as last resort
    if (this.state.error) {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <ErrorState
            type="unknown"
            title="Erreur de l'application"
            message="Une erreur s'est produite dans l'application. Essayez de recharger la page."
            onRetry={this.handleRetry}
            className="w-full max-w-2xl mx-4"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

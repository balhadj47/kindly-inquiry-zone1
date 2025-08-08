
import React from 'react';
import { Loader2 } from 'lucide-react';
import { ErrorState } from '@/components/common/ErrorStates';
import { ErrorType } from '@/services/errorHandlingService';

export const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
      <p className="text-gray-600">Chargement des utilisateurs...</p>
    </div>
  </div>
);

interface ErrorStateProps {
  error?: Error;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const UsersErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  isRetrying 
}) => {
  // Determine error type based on error message
  let errorType: ErrorType = 'server';
  
  if (error?.message.includes('permission') || error?.message.includes('Authentication required')) {
    errorType = 'authorization';
  } else if (error?.message.includes('network') || error?.message.includes('fetch')) {
    errorType = 'network';
  }

  return (
    <ErrorState
      type={errorType}
      message={error?.message}
      onRetry={onRetry}
      isRetrying={isRetrying}
    />
  );
};

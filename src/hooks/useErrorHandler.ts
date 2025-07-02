
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`🔴 Error ${context ? `in ${context}` : ''}:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
  }, [toast]);

  const handleAsyncError = useCallback(async (asyncFn: () => Promise<void>, context?: string) => {
    try {
      await asyncFn();
    } catch (error) {
      handleError(error, context);
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};


import { useCallback } from 'react';
import { errorHandler, ErrorType } from '@/services/errorHandlingService';

export const useStandardErrorHandler = () => {
  const handleError = useCallback((error: unknown, context?: string) => {
    return errorHandler.handleError(error, context);
  }, []);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<void>, 
    context?: string,
    showToast = true
  ) => {
    return await errorHandler.handleAsyncOperation(asyncFn, context, showToast);
  }, []);

  const classifyError = useCallback((error: unknown, context?: string) => {
    return errorHandler.classifyError(error, context);
  }, []);

  return { 
    handleError, 
    handleAsyncError, 
    classifyError 
  };
};


import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useStandardErrorHandler } from './useStandardErrorHandler';
import { useEffect } from 'react';

export function useQueryWithStandardError<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[]
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    context?: string;
    showErrorToast?: boolean;
  }
): UseQueryResult<TData, TError> {
  const { handleError } = useStandardErrorHandler();
  
  const queryResult = useQuery(options);

  // Handle errors using useEffect when error state changes
  useEffect(() => {
    if (queryResult.error && options.showErrorToast !== false) {
      handleError(queryResult.error, options.context);
    }
  }, [queryResult.error, handleError, options.context, options.showErrorToast]);

  return queryResult;
}
